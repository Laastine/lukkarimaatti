/* global define, $, _, moment, Handlebars, Bloodhound, console */
define(['jquery', 'underscore', 'moment', 'handlebars', 'bloodhound', 'text!templates/loadModal.html', 'typeahead'],
    function ($, _, moment, Handlebars, Bloodhound, loadModal) {
        'use strict';

        var courseCollection = [];
        var load = $(loadModal);

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
                                t: course.type
                            };
                        });
                        return _.uniq(courseCollection, function (item) {
                            return item.title + item.code;
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
                        courseCollection = courseCollection.filter(function (el) {
                            return el.code === item.code;
                        });
                        if (courseCollection[0].title.length !== 0) {
                            that.addCourseLink(courseCollection[0].title, courseCollection[0].code);
                        }
                        load.modal('toggle');
                        setTimeout(function () {
                            that.addDataToCalendar(eventCal);
                        }, 300);
                        that.addUrlParameter(courseCollection[0].title, courseCollection[0].code);
                    });
            },

            addUrlParameter: function (courseName, courseCode) {
                var params = window.location.search;
                if (params.length > 0) {
                    history.pushState(
                        {}, "", "index.html?" + params.substring(1, params.length) + '+' + courseCode);
                } else {
                    history.pushState(
                        {}, "", "index.html?" + params + courseCode);
                }
            },

            removeUrlParameter: function (id) {
                var params = window.location.search;
                var updatedParams = params.substring(1, params.length).split('+').filter(function (p) {
                    return p !== id;
                });
                if (updatedParams.length > 0) {
                    history.pushState({}, "", "index.html?" + updatedParams.join('+'));
                } else {
                    history.pushState({}, "", "index.html");
                }
            },

            refresh: function (calendar) {
                var params = window.location.search;
                var courseCodes = params.substring(1, params.length).split(/[+]/);
                var that = this;
                if (courseCodes[0].length > 0) {
                    load.modal('toggle');
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
                                    that.addCourseLink(data[0].courseName, data[0].courseCode);
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
                    load.modal('hide');
                }
            },

            addCourseLink: function (courseName, courseCode) {
                var noppa = 'https://noppa.lut.fi/noppa/opintojakso/';
                $('#courseList').append('<tr id="' + courseCode + '"><td>' +
                    '<a href=' + noppa + courseCode + ' target="_blank">' + courseName + '</a>' +
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
                courseCollection.forEach(function (course) {
                    function processWeekNumbers(weekNumber) {
                        var dateStart = moment().lang('fi').day(course.wd).week(weekNumber).hours(course.tof.split('-')[0] || 6).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
                        var dateEnd = moment().lang('fi').day(course.wd).week(weekNumber).hours(course.tof.split('-')[1] || 6).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
                        var calendarEvent = {
                            title: course.code,
                            description: course.title + '/' + course.t + '\n' + course.cr,
                            start: new Date(dateStart),
                            end: new Date(dateEnd),
                            element: null,
                            view: null,
                            id: course.code + '#' + course.t
                        };
                        courseToBeAdded.push(calendarEvent);
                    }
                    JSON.parse('[' + course.wn + ']').forEach(processWeekNumbers);
                });
                calendar.createCalendarEvent(courseToBeAdded);

                load.modal('hide');
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
