var $ = require('jquery')(window);
//window.$ = $; // hack to make typeahead work
var Handlebars = require('handlebars'),
    Bloodhound = require("typeahead.js/dist/bloodhound"),
    typeahead = require("typeahead.js"),
    moment = require('moment'),
    _ = require('underscore'),
    Backbone = require('backbone')
Backbone.$ = $
var SearchEngine = {
    courseCollection: [],

    engine: new Bloodhound({
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.num);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/rest/cnames/%QUERY',
            filter: function (data) {
                var that = this
                that.courseCollection = data
                return _.uniq(that.courseCollection, function (cc) {
                    return cc.courseName + cc.courseCode + cc.groupName
                })
            }
        },
        limit: 10
    }),

    searchBox: function (eventCal) {
        this.engine.initialize()
        var that = this
        $('#courseSearchBox').typeahead({
                hint: true,
                highlight: true,
                minLength: 2
            },
            {
                name: 'courses',
                displayKey: 'name',
                source: that.engine.ttAdapter(),
                templates: {
                    empty: [
                        '<p><strong>',
                        'Unable to find any courses that match the current query',
                        '</strong></p>'
                    ].join('\n'),
                    suggestion: Handlebars.compile('<p><strong>{{courseName}}</strong> - {{courseCode}}</p>')
                }
            }
        ).on('typeahead:selected', function (evt, course) {
                console.log('course=' + JSON.stringify(course))
                this.courseCollection = this.courseCollection.filter(function (c) {
                    return c.courseCode === course.courseCode
                })

                if (course.groupName.length > 0 && course.courseCode.substring(0, 2) === 'FV') {
                    this.courseCollection = this.courseCollection.filter(function (c) {
                        return c.groupName === course.groupName
                    })
                }

                if (this.courseCollection.length > 0) {
                    that.addCourseLink(this.courseCollection[0].courseName, this.courseCollection[0].courseCode, this.courseCollection.length)
                }

                that.addDataToCalendar(eventCal)
                that.addUrlParameter(this.courseCollection[0].courseCode, this.courseCollection[0].groupName)
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
            function processWeekNumbers(weekNumber) {
                var dateStart = moment()
                    .lang('fi')
                    .years(that.getYearNumber(weekNumber))
                    .day(course.weekDay)
                    .week(weekNumber)
                    .hours(course.timeOfDay.split('-')[0] || 6).minutes(0)
                    .seconds(0)
                    .format('YYYY-MM-DDTHH:mm:ssZ')
                var dateEnd = moment()
                    .lang('fi')
                    .years(that.getYearNumber(weekNumber))
                    .day(course.weekDay).week(weekNumber)
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
            }

            JSON.parse('[' + course.weekNumber + ']').map(processWeekNumbers)
        })
        calendar.createCalendarEvent(courseToBeAdded)
    },

    getYearNumber: function (weekNumber) {
        var isSpringSemester = moment().week() < 35
        if (!isSpringSemester) {
            return parseInt(weekNumber, 10) < 35 ? moment().add(1, 'y').year() : moment().year()
        } else {
            return parseInt(weekNumber, 10) >= 35 ? moment().subtract(1, 'y').year() : moment().year()
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
