/* global define, $, _, moment, Handlebars, Bloodhound, console */
define(['jquery', 'underscore', 'moment', 'handlebars', 'bloodhound', 'typeahead'],
    function ($, _, moment, Handlebars, Bloodhound) {
        'use strict';

        var courseCollection = [];

        var SearchEngine = {
            engine: new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/rest/cnames/%QUERY',
                    filter: function (response) {
                        courseCollection = $.map(response, function (course) {
                            return {
                                title: course.courseName,
                                code: course.courseCode,
                                tof: course.timeOfDay,
                                wd: course.weekDay,
                                wn: course.weekNumber,
                                cr: course.classroom,
                                t: course.type,
                                g: course.groupName
                            };
                        });
                        return _.uniq(courseCollection, function (item) {
                            return item.title + item.code + item.g;
                        });
                    }
                },
                limit: 10
            }),

            searchBox: function (eventCal) {
                var that = this;
                $('#courseSearchBox').typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 2
                    },
                    {
                        name: 'courses',
                        displayKey: 'name',
                        source: this.engine.ttAdapter(),
                        templates: {
                            empty: [
                                '<p><strong>',
                                'Unable to find any courses that match the current query',
                                '</strong></p>'
                            ].join('\n'),
                            suggestion: Handlebars.compile('<p><strong>{{title}}</strong> - {{code}}</p>')
                        }
                    }
                ).on('typeahead:selected', function (evt, item) {
                        courseCollection = courseCollection.filter(function (c) {
                            return c.code === item.code;
                        });

                        if(item.g.length > 0) {
                            courseCollection = courseCollection.filter(function (c) {
                                return c.g === item.g;
                            });
                        }

                        if (courseCollection[0].title.length !== 0) {
                            that.addCourseLink(courseCollection[0].title, courseCollection[0].code, courseCollection.length);
                        }

                        that.addDataToCalendar(eventCal);
                        that.addUrlParameter(courseCollection[0].code, courseCollection[0].g);
                    });
            },

            addUrlParameter: function (courseCode, groupName) {
                var params = window.location.search;
                var par = courseCode.substring(0,2) === 'FV' ? courseCode+'&'+groupName : courseCode;
                if (params.length > 0) {
                    history.pushState(
                        {}, "", "index.html?" + params.substring(1, params.length) + '+' + par);
                } else {
                    history.pushState(
                        {}, "", "index.html?" + params + par);
                }
            },

            removeUrlParameter: function (id) {
                var params = window.location.search;
                var updatedParams = params.substring(1, params.length).split('+').filter(function (p) {
                    if(p.indexOf('&') > -1) {
                        var groupLetterStripped = p.substring(0, p.indexOf('&'));
                        return groupLetterStripped !== id;
                    } else {
                        return p !== id;
                    }
                });
                if (updatedParams.length > 0) {
                    history.pushState({}, "", "index.html?" + updatedParams.join('+'));
                } else {
                    history.pushState({}, "", "index.html");
                }
            },

            getDataOnRefresh: function (calendar) {
                var params = window.location.search;
                var courseCodes = params.substring(1, params.length).split(/[+]/);
                var that = this;
                if (courseCodes[0].length > 0) {
                    courseCodes.forEach(function (cc) {
                        if (typeof cc !== 'undefined') {
                            $.ajax({
                                url: '/rest/code/' + cc,
                                type: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    courseCollection = $.map(data, function (course) {
                                        return {
                                            title: course.courseName,
                                            code: course.courseCode,
                                            tof: course.timeOfDay,
                                            wd: course.weekDay,
                                            wn: course.weekNumber,
                                            cr: course.classroom,
                                            t: course.type
                                        };
                                    });
                                    that.addCourseLink(data[0].courseName, data[0].courseCode, data.length);
                                    that.addDataToCalendar(calendar);
                                },
                                error: function (xhr, status, error) {
                                    console.log('xhr' + xhr + ', status=' + status + ', error=' + error);
                                }
                            });
                        } else {
                            console.log('Not a valid course code');
                        }
                    });
                }
            },

            addCourseLink: function (courseName, courseCode, occ) {
                if(typeof occ === 'undefined') {
                    occ = 0;
                }
                var noppa = 'https://noppa.lut.fi/noppa/opintojakso/';
                $('#courseList').append('<tr id="' + courseCode + '"><td>' +
                    '<a href=' + noppa + courseCode + ' target="_blank">' + occ + ', ' +courseCode + ' - ' + courseName + '</a>' +
                    '</td><td>' +
                    '<button id="deleteButton" class="button" type="button">' +
                    '<span class="glyphicon glyphicon-remove"></span>' +
                    '</button>' +
                    '</td></tr>');
            },

            removeCourseItem: function (element, id) {
                $(element).remove();
                this.removeUrlParameter(id);
            },

            addDataToCalendar: function (calendar) {
                var courseToBeAdded = [];
                var that = this;

                courseCollection.map(function (course) {
                    function processWeekNumbers(weekNumber) {
                        var dateStart = moment()
                            .lang('fi')
                            .years(that.getYearNumber(weekNumber))
                            .day(course.wd)
                            .week(weekNumber)
                            .hours(course.tof.split('-')[0] || 6).minutes(0)
                            .seconds(0)
                            .format('YYYY-MM-DDTHH:mm:ssZ');
                        var dateEnd = moment()
                            .lang('fi')
                            .years(that.getYearNumber(weekNumber))
                            .day(course.wd).week(weekNumber)
                            .hours(course.tof.split('-')[1] || 6)
                            .minutes(0)
                            .seconds(0)
                            .format('YYYY-MM-DDTHH:mm:ssZ');
                        var calendarEvent = {
                            title: course.code,
                            description: course.title + '/' + course.t + '\n' + course.cr,
                            start: new Date(dateStart),
                            end: new Date(dateEnd),
                            element: null,
                            color: that.stringToColour(course.code),
                            view: null,
                            id: course.code + '#' + course.t
                        };
                        courseToBeAdded.push(calendarEvent);
                    }
                    JSON.parse('[' + course.wn + ']').map(processWeekNumbers);
                });
                calendar.createCalendarEvent(courseToBeAdded);
            },

            getYearNumber: function (weekNumber) {
                var isSpringSemester = moment().week() < 35;
                if(!isSpringSemester) {
                    return parseInt(weekNumber, 10) < 35 ? moment().add(1, 'y').year() : moment().year();
                } else {
                    return parseInt(weekNumber, 10) >= 35 ? moment().subtract(1, 'y').year() : moment().year();
                }
            },

            stringToColour: function(colorSeed) {
                var hash = 0, colour = '#', value;
                colorSeed.split("").forEach(function (e) {
                    hash = colorSeed.charCodeAt(e) + ((hash << 5) - hash);
                });
                for (var j = 0; j < 3; j++) {
                    value = (hash >> (j * 8)) & 0xFF;
                    colour += ('00' + value.toString(16)).substr(-2);
                }
                return colour;
            },

            sendLink: function (address) {
                var link = window.location.href.toString();
                $.ajax({
                    type: "POST",
                    url: '/app/save',
                    data: { email: address, link: link },
                    dataType: 'json'
                });
            }

        };

        return SearchEngine;
    });
