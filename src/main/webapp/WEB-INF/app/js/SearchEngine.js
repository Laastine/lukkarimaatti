define(['jquery', 'underscore', 'moment', 'handlebars', 'bloodhound', 'text!templates/loadModal.html', 'typeahead'],
    function ($, _, moment, Handlebars, Bloodhound, loadModal) {
        'use strict';

        var courseCollection = {};
        var load = $(loadModal);

        var engine = new Bloodhound(
            {
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
            }
        );

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
                        addCourseItem(courseCollection[0].title, courseCollection[0].code);
                    }
                    load.modal('toggle');
                    setTimeout(function(){ addDataToCalendar(eventCal);}, 300);
                });
        };

        var addUrlParameter = function (courseName, courseCode) {
            var params = window.location.search;
            if (params.length > 0) {
                console.log('not zero');
                history.pushState(
                    {
                        name: courseName,
                        code: courseCode
                    },
                    "",
                        "index.html?" + params.substring(1, params.length) + '+' + courseCode);
            } else {
                console.log('more than zero');
                history.pushState(
                    {
                        name: courseName,
                        code: courseCode
                    },
                    "",
                        "index.html?" + params + courseCode);
            }
        };

        var refresh = function()  {
            var courseData = {};
            var params = window.location.search;
            var courseCodes = params.substring(1, params.length).split(/[+]/);
            console.log('courseCodes='+courseCodes);
            if(typeof courseCodes !== 'undefined') {
                $.ajax({
                    url: '/rest/code/BM40A0700',
                    type: 'GET',

                    dataType: 'json',
                    success: function(data, textStatus) {
                        console.log('reload, data='+data+', status='+textStatus);
                        courseData = data;
                    },
                    error:function(xhr, status, error) {
                        console.log('xhr'+xhr+', status='+status+', error='+error);
                    }
                });
            } else {
                console.log('not valid course code');
            }
            console.log('courseData='+courseData.courseName+', '+courseData.courseCode);
            //addCourseItem(courseData.courseName, courseData.courseCode);
        };

        var addCourseItem = function (courseName, courseCode) {
            var noppa = 'https://noppa.lut.fi/noppa/opintojakso/';
            $('#courseList')
                .append('<li id="+'+courseCode+'+" data-filtertext="' + courseName + '"><a href=' + noppa + courseCode + ' target="_blank">' + courseName + '</a> ' +
                    '<button class="btn btn-default btn-sm" type="button">' +
                    '<span class="glyphicon glyphicon-remove"></span>' +
                    '</button></li>');
        };

        var removeCourseItem = function (courseName, courseCode) {
            $('#courseList').attr('id', courseCode).remove('<li data-filtertext="' + courseName + '"><a href=' + noppa + courseCode + ' target="_blank">' + courseName + '</a></li>');
        };

        var addDataToCalendar = function (calendar) {
            function processCourse(course) {
                function processWeekNumbers(weekNumber) {
                    var hStart = course.tof.split('-')[0] || 6;
                    var hEnd = course.tof.split('-')[1] || 6;
                    var dateStart = moment().lang('fi').day(course.wd).week(weekNumber).hours(hStart).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
                    var dateEnd = moment().lang('fi').day(course.wd).week(weekNumber).hours(hEnd).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
                    calendar.createCalendarEvent(course, dateStart, dateEnd);
                }

                var weekNumber = JSON.parse('[' + course.wn + ']');
                weekNumber.forEach(processWeekNumbers);
            }

            courseCollection.forEach(processCourse);
            load.modal('hide');
        };

        return {
            engine: engine,
            searchBox: searchBox
        };

    });
