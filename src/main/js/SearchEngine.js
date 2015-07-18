var $ = jquery = require('jquery'),
    moment = require('moment'),
    select2 = require("select2"),
    _ = require('underscore'),
    Backbone = require('backbone')
require('moment/locale/fi')
global.jQuery = $;


var SearchEngine = {
    courseCollection: [],
    searchBox: function (eventCal) {
        var that = this

        $("#searchbar").select2({
            ajax: {
                url: "http://localhost:8080/lukkarimaatti/rest/course/",
                dataType: 'json',
                delay: 150,
                data: function (params) {
                    return {
                        name: params.term,
                        page: params.page
                    }
                },
                processResults: function (data, page) {
                    that.courseCollection = _.chain(data).filter(function (cc) {
                        return cc.courseName.toLowerCase().indexOf(page.term.toLowerCase()) > -1
                    }).map(function (obj) {
                        obj.id = obj.courseId
                        obj.text = obj.courseName + ' - ' + obj.courseCode
                        return obj
                    }).uniq(function (cc) {
                        return cc.courseName + cc.courseCode + cc.groupName
                    }).value()
                    var res = {
                        results: that.courseCollection
                    }
                    return res
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup
            },
            minimumInputLength: 2,
            templateResult: function (data) {
                if (data.loading) return data.text
                var markup = '<p><strong>' + data.courseName + '</strong> - ' + data.courseCode + '</p>'
                if (data.groupName) {
                    markup += '<div>' + data.groupName + '</div>'
                }
                markup += '</div></div>'
                return markup
            },
            templateSelection: function (data) {
                return '<b>' + data.courseName + '</b>'
            }
        }).on("select2:select", function (event) {
            var course = event.params.data
            that.courseCollection = that.courseCollection.filter(function (c) {
                return c.courseCode === course.courseCode;
            });

            if (course.groupName.length > 0 && course.courseCode.substring(0, 2) === 'FV') {
                that.courseCollection = that.courseCollection.filter(function (c) {
                    return c.groupName === course.groupName;
                });
            }

            if (that.courseCollection.length > 0) {
                that.addCourseLink(that.courseCollection[0].courseName, that.courseCollection[0].courseCode, that.courseCollection.length);
            }

            that.addDataToCalendar(eventCal);
            that.addUrlParameter(that.courseCollection[0].courseCode, that.courseCollection[0].groupName);
        })
    },

    addUrlParameter: function (courseCode, groupName) {
        var params = window.location.search
        var urlParam = courseCode.substring(0, 2) === 'FV' ? courseCode + '&' + groupName : courseCode
        if (params.length > 0) {
            history.pushState(
                {}, "", "index.html?" + params.substring(1, params.length) + '+' + urlParam)
        } else {
            history.pushState(
                {}, "", "index.html?" + params + urlParam)
        }
    },

    removeUrlParameter: function (id) {
        var params = window.location.search
        var updatedParams = params.substring(1, params.length).split('+').filter(function (p) {
            if (p.indexOf('&') > -1) {
                var groupLetterStripped = p.substring(0, p.indexOf('&'))
                return groupLetterStripped !== id
            } else {
                return p !== id
            }
        })
        if (updatedParams.length > 0) {
            history.pushState({}, "", "index.html?" + updatedParams.join('+'))
        } else {
            history.pushState({}, "", "index.html")
        }
    },

    getDataOnRefresh: function (calendar) {
        var params = window.location.search
        var courseCodes = params.substring(1, params.length).split(/[+]/)
        var that = this
        if (courseCodes[0].length > 0) {
            courseCodes.forEach(function (param) {
                var groupLetter = ""
                if (param.indexOf('&') > -1) {
                    groupLetter = param.substring(param.indexOf('&') + 1, param.length)
                    param = param.substring(0, param.indexOf('&'))
                }
                if (typeof param !== 'undefined') {
                    $.ajax({
                        url: '/rest/code/' + param,
                        type: 'GET',
                        success: function (data) {
                            that.courseCollection = data
                            if (groupLetter.length > 0 && data[0].courseCode.substring(0, 2) === 'FV') {
                                that.courseCollection = that.courseCollection.filter(function (d) {
                                    return d.groupName === groupLetter
                                })
                            }
                            that.addCourseLink(data[0].courseName, data[0].courseCode, data.length)
                            that.addDataToCalendar(calendar)
                        },
                        error: function (xhr, status, error) {
                            console.error('param ' + param + 'xhr' + xhr + ', status=' + status + ', error=' + error)
                        }
                    })
                } else {
                    console.log('Not a valid course code')
                }
            })
        }
    },

    addCourseLink: function (courseName, courseCode, occ) {
        if (typeof occ === 'undefined') {
            occ = 0
        }
        var noppa = 'https://noppa.lut.fi/noppa/opintojakso/'
        $('#courseList').append('<tr id="' + courseCode + '"><td>' +
            '<a href=' + noppa + courseCode + ' target="_blank">' + occ + ', ' + courseCode + ' - ' + courseName + '</a>' +
            '</td><td>' +
            '<button id="deleteButton" class="button" type="button">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
            '</button>' +
            '</td></tr>')
    },

    removeCourseItem: function (element, id) {
        $(element).remove()
        this.removeUrlParameter(id)
    },

    addDataToCalendar: function (calendar) {
        var courseToBeAdded = []
        var that = this

        this.courseCollection.forEach(function (course) {
            JSON.parse('[' + course.weekNumber + ']').map(function processWeekNumbers(weekNumber) {
                var dateStart = moment()
                    .locale('fi')
                    .year(that.getYearNumber(weekNumber))
                    .day(course.weekDay)
                    .week(weekNumber)
                    .hours(course.timeOfDay.split('-')[0] || 6).minutes(0)
                    .seconds(0)
                    .format('YYYY-MM-DDTHH:mm:ssZ')
                var dateEnd = moment()
                    .locale('fi')
                    .year(that.getYearNumber(weekNumber))
                    .day(course.weekDay)
                    .week(weekNumber)
                    .hours(course.timeOfDay.split('-')[1] || 6)
                    .minutes(0)
                    .seconds(0)
                    .format('YYYY-MM-DDTHH:mm:ssZ')
                var calendarEvent = {
                    title: course.courseCode,
                    description: course.courseName + '/' + course.type + '\n' + course.classroom,
                    start: new Date(dateStart),
                    end: new Date(dateEnd),
                    element: null,
                    color: that.stringToColour(course.courseCode),
                    view: null,
                    id: course.courseCode + '#' + course.type
                }
                courseToBeAdded.push(calendarEvent)
            })
            console.log('to be added='+JSON.stringify(courseToBeAdded[0]))
        })
        calendar.createCalendarEvent(courseToBeAdded)
    },

    getLocalizedDayOfWeek: function (day) {
        var weekDays = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']
        return weekDays.indexOf(day)
    },

    getYearNumber: function (weekNumber) {
        var isSpringSemester = moment().week() < 35
        if (isSpringSemester) {
            return parseInt(weekNumber, 10) < 35 ? moment().add(1, 'y').year() : moment().year()
        } else {
            return parseInt(weekNumber, 10) >= 35 ? moment().year() : moment().year()
        }
    },

    stringToColour: function (colorSeed) {
        var hash = 0, colour = '#', value
        colorSeed.split("").forEach(function (e) {
            hash = colorSeed.charCodeAt(e) + ((hash << 5) - hash)
        })
        for (var j = 0; j < 3; j++) {
            value = (hash >> (j * 8)) & 0xFF
            colour += ('00' + value.toString(16)).substr(-2)
        }
        return colour
    },

    sendLink: function (address) {
        var link = window.location.href.toString()
        $.ajax({
            type: "POST",
            url: '/app/save',
            data: {email: address, link: link},
            dataType: 'json'
        })
    }

}

module.exports = SearchEngine
