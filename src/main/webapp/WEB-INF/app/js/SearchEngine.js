define(['jquery', 'underscore', 'moment', 'handlebars', 'bloodhound', 'text!templates/loadModal.html', 'typeahead'],
    function ($, _, moment, Handlebars, Bloodhound, loadModal) {
        'use strict';

        var courseCollection = [];
        var load = $(loadModal);

        var engine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/rest/cnames/%QUERY',
                filter: function (response) {
                    mapResponse(response);
                    return _.uniq(courseCollection, function (item) {
                        return item.title + item.code;
                    });
                }
            },
            limit: 10
        });

        var mapResponse = function (response) {
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
        };

        var searchBox = function (eventCal) {
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
                        addCourseLink(courseCollection[0].title, courseCollection[0].code);
                    }
                    load.modal('toggle');
                    setTimeout(function () {
                        addDataToCalendar(eventCal);
                    }, 300);
                    addUrlParameter(courseCollection[0].title, courseCollection[0].code);
                });
        };

        var addUrlParameter = function (courseName, courseCode) {
            var params = window.location.search;
            if (params.length > 0) {
                history.pushState(
                    {
                        name: courseName,
                        code: courseCode
                    }, "", "index.html?" + params.substring(1, params.length) + '+' + courseCode);
            } else {
                history.pushState(
                    {
                        name: courseName,
                        code: courseCode
                    }, "", "index.html?" + params + courseCode);
            }
        };

        var removeUrlParameter = function () {
            var params = window.location.search;
        };

        var refresh = function (calendar) {
            var params = window.location.search;
            var courseCodes = params.substring(1, params.length).split(/[+]/);
            load.modal('toggle');
            if (courseCodes.length > 0) {
                courseCodes.forEach(function (cc) {
                    if (typeof cc !== 'undefined') {
                        $.ajax({
                            url: '/rest/code/' + cc,
                            type: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                mapResponse(data);
                                addCourseLink(data[0].courseName, data[0].courseCode);
                                addDataToCalendar(calendar);
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
            load.modal('hide');
        };

        var addCourseLink = function (courseName, courseCode) {
            var noppa = 'https://noppa.lut.fi/noppa/opintojakso/';
            $('#courseList').append('<tr><td id="'+courseCode+'">' +
                '<a href=' + noppa + courseCode + ' target="_blank">' + courseName + '</a>' +
                '</td><td>' +
                '<button id="deleteButton" class="button" type="button">' +
                '<span class="glyphicon glyphicon-remove"></span>' +
                '</button>' +
                '</td></tr>');
        };

        var removeCourseItem = function (id) {
            $(id).remove();
        };

        var addDataToCalendar = function (calendar) {
            courseCollection.forEach(function (course) {
                function processWeekNumbers(weekNumber) {
                    var dateStart = moment().lang('fi').day(course.wd).week(weekNumber).hours(course.tof.split('-')[0] || 6).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
                    var dateEnd = moment().lang('fi').day(course.wd).week(weekNumber).hours(course.tof.split('-')[1] || 6).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
                    calendar.createCalendarEvent(course, dateStart, dateEnd);
                }
                JSON.parse('[' + course.wn + ']').forEach(processWeekNumbers);
            });
            load.modal('hide');
        };

        return {
            engine: engine,
            searchBox: searchBox,
            onPageLoad: refresh,
            onClickDelete: removeCourseItem
        };

    });
