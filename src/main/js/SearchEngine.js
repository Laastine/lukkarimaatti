var $ = require('jquery'),
    select2 = require("select2"),
    moment = require('moment'),
    _ = require('underscore'),
    Backbone = require('backbone')

var courseCollection = []

var SearchEngine = {
    searchBox: function (eventCal) {
        var that = this
        function formatCourse (repo) {
            if (repo.loading) return repo.text
            var markup = '<p><strong>'+repo.courseName+'</strong> - '+repo.courseCode+'</p>'
            if (repo.groupName) { markup += '<div>' + repo.groupName + '</div>' }
            markup += '</div></div>'
            return markup
        }

        function formatCourseSelection (repo) {
            console.log('formatCourseSelection='+JSON.stringify(repo))
            return repo.courseName || repo.courseCode
        }
        $("#searchbar").select2({
            placeholder: "Select a course",
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
                    // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data
                    courseCollection = data
                    return {
                        results: _.uniq(data, function (cc) {
                            return cc.courseName + cc.courseCode + cc.groupName
                        })
                    }
                },
                transport: function (params, success, failure) {
                    var $request = $.ajax(params);

                    $request.then(success);
                    $request.fail(failure);

                    return $request;
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup }, // let our custom formatter work
            minimumInputLength: 2,
            templateResult: formatCourse, // omitted for brevity, see the source of this page
            templateSelection: formatCourseSelection // omitted for brevity, see the source of this page
        }).on('select2:select', function (event, course) {
            console.log('course=' + JSON.stringify(course))
            courseCollection = courseCollection.filter(function (c) {
                return c.courseCode === course.courseCode;
            });

            if (course.groupName.length > 0 && course.courseCode.substring(0, 2) === 'FV') {
                courseCollection = courseCollection.filter(function (c) {
                    return c.groupName === course.groupName;
                });
            }

            if (courseCollection.length > 0) {
                that.addCourseLink(courseCollection[0].courseName, courseCollection[0].courseCode, courseCollection.length);
            }

            that.addDataToCalendar(eventCal);
            that.addUrlParameter(courseCollection[0].courseCode, courseCollection[0].groupName);
        });
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
