var $ = require('jquery'),
    moment = require('moment'),
    _ = require('underscore'),
    typeahead = require("typeahead.js-browserify"),
    Bloodhound = require("typeahead.js-browserify").Bloodhound,
    Handlebars = require('handlebars')

require('backbone')
typeahead.loadjQueryPlugin()
require('moment/locale/fi')

var courseCollection = []

var SearchEngine = {

    engine: new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: 'course',
            replace: function(url, query) {
                return url + "?name=" + query.toLocaleLowerCase()
            },
            filter: function(data) {
                courseCollection = data
                return  _.uniq(courseCollection, function(cc) {
                    return cc.course_name + cc.course_code + cc.group_name
                })
            }
        },
        limit: 10
    }),

    searchBox: function(eventCal) {
        var that = this
        this.engine.initialize()
        $('#searchbar .typeahead')
            .typeahead({
                hint: true,
                highlight: true,
                minLength: 2
            },
            {
                name: 'courses',
                limit: 10,
                displayKey: 'name',
                source: that.engine.ttAdapter(),
                templates: {
                    empty: [
                        '<p><strong>',
                        'Unable to find any courses that match the current query',
                        '</strong></p>'
                    ].join('\n'),
                    suggestion: Handlebars.compile('<p><strong>{{course_name}}</strong> - {{course_code}}</p>')
                }
            })
            .on('typeahead:selected', function(evt, course) {
                courseCollection = courseCollection.filter(function(c) {
                    return c.course_code === course.course_code
                })

                if (course.group_name.length > 0 && course.course_code.substring(0, 2) === 'FV') {
                    courseCollection = courseCollection.filter(function(c) {
                        return c.group_name === course.group_name
                    })
                }

                if (courseCollection.length > 0) {
                    that.addCourseLink(courseCollection[0].course_name, courseCollection[0].course_code, courseCollection.length)
                }

                that.addDataToCalendar(eventCal)
                that.addUrlParameter(courseCollection[0].course_code, courseCollection[0].group_name)
            })
    },

    addUrlParameter: function(course_code, group_name) {
        var params = window.location.search
        var urlParam = course_code.substring(0, 2) === 'FV' ? course_code + '&' + group_name : course_code
        if (params.length > 0) {
            history.pushState(
                {}, "", "?" + params.substring(1, params.length) + '+' + urlParam)
        } else {
            history.pushState(
                {}, "", "?" + params + urlParam)
        }
    },

    removeUrlParameter: function(id) {
        var params = window.location.search
        var updatedParams = params.substring(1, params.length).split('+').filter(function(p) {
            if (p.indexOf('&') > -1) {
                var groupLetterStripped = p.substring(0, p.indexOf('&'))
                return groupLetterStripped !== id
            } else {
                return p !== id
            }
        })
        if (updatedParams.length > 0) {
            history.pushState({}, "", "?" + updatedParams.join('+'))
        } else {
            history.pushState({}, "", "?");
        }
    },

    getDataOnRefresh: function(calendar) {
        var params = window.location.search
        var courseCodes = params.substring(1, params.length).split(/[+]/)
        var that = this
        if (courseCodes[0].length > 0) {
            courseCodes.forEach(function(param) {
                var groupLetter = ""
                if (param.indexOf('&') > -1) {
                    groupLetter = param.substring(param.indexOf('&') + 1, param.length)
                    param = param.substring(0, param.indexOf('&'))
                }
                if (typeof param !== 'undefined' && groupLetter.length > 0) {
                    $.ajax({
                        url: 'codeAndGroup',
                        type: 'GET',
                        data: {
                            groupName: groupLetter,
                            code: param
                        },
                        success: function(data) {
                            courseCollection = data
                            if (groupLetter.length > 0 && data[0].course_code.substring(0, 2) === 'FV') {
                                courseCollection = courseCollection.filter(function(d) {
                                    return d.group_name === groupLetter
                                })
                            }
                            that.addCourseLink(data[0].course_name, data[0].course_code, data.length)
                            that.addDataToCalendar(calendar)
                        },
                        error: function(xhr, status, error) {
                            console.error('param ' + param + 'xhr' + xhr + ', status=' + status + ', error=' + error)
                        }
                    })
                } else if (typeof param !== 'undefined') {
                    $.ajax({
                        url: 'code/' + param,
                        type: 'GET',
                        success: function(data) {
                            courseCollection = data
                            that.addCourseLink(data[0].course_name, data[0].course_code, data.length)
                            that.addDataToCalendar(calendar)
                        },
                        error: function(xhr, status, error) {
                            console.error('param ' + param + 'xhr' + xhr + ', status=' + status + ', error=' + error)
                        }
                    })
                }
            })
        }
    },

    addCourseLink: function(course_name, course_code, occ) {
        if (!occ) {
            occ = 0
        }
        var noppa = 'https://noppa.lut.fi/noppa/opintojakso/'
        $('#courseList').append('<tr id="' + course_code + '"><td>' +
            '<a href=' + noppa + course_code + ' target="_blank">' + occ + ', ' + course_code + ' - ' + course_name + '</a>' +
            '</td><td>' +
            '<button id="deleteButton" class="button" type="button">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
            '</button>' +
            '</td></tr>')
    },

    removeCourseItem: function(element, id) {
        $(element).remove()
        this.removeUrlParameter(id)
    },

    addDataToCalendar: function(calendar) {
        var courseToBeAdded = []
        var that = this

        var getTimestamp = function getTimestamp(course, weekNumber, hour) {
            return moment(that.getYearNumber(course.week) + '-' + weekNumber + '-' + course.week_day + '-' + hour, 'YYYY-ww-dd-hh')
        }

        courseCollection.forEach(function (course) {
            JSON.parse('[' + course.week + ']')
                .map(function processWeekNumbers(weekNumber) {

                    var calendarEvent = {
                        title: course.course_code,
                        description: course.course_name + '/' + course.type + '\n' + course.classroom,
                        start: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[0] || 6)),
                        end: new Date(getTimestamp(course, weekNumber, course.time_of_day.split('-')[1] || 6)),
                        element: null,
                        color: that.stringToColour(course.course_code),
                        view: null,
                        id: course.course_code + '#' + course.type
                    }
                    courseToBeAdded.push(calendarEvent)
                })
        })
        calendar.createCalendarEvent(courseToBeAdded)
    },

    getYearNumber: function(courseWeekNumber) {
        var isSpringSemester = moment().week() === 53 || moment().week() < 27
        var week = parseInt(courseWeekNumber, 10)
        var springCourse = (week > 0 && week < 35 || week === 53)
        if (isSpringSemester) {
            return springCourse ? moment().year() : moment().subtract(1, 'year').year()
        } else {
            return springCourse ? moment().add(1, 'y').year() : moment().year()
        }
    },

    stringToColour: function(colorSeed) {
        var hash = 0, colour = '#', value
        colorSeed.split("").forEach(function(e) {
            hash = colorSeed.charCodeAt(e) + ((hash << 5) - hash)
        })
        for (var j = 0; j < 3; j++) {
            value = (hash >> (j * 8)) & 0xFF
            colour += ('00' + value.toString(16)).substr(-2)
        }
        return colour
    },

    sendLink: function(address) {
        var link = window.location.href.toString()
        $.ajax({
            type: "POST",
            url: 'save',
            data: {email: address, link: link},
            dataType: 'json'
        })
    }
}

module.exports = SearchEngine
