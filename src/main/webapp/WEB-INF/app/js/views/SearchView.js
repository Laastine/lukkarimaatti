define(['handlebars', 'moment', 'bloodhound', 'typeahead', 'views/EventCalendarView', 'text!templates/search.html'],
    function (Handlebars, moment, Bloodhound, typeahead, EventCalendarView, searchTemplate) {
        'use strict';

        var courseCollection;

        var SearchView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this, 'searchBox', 'addCourseItem', 'removeCourseItem', 'addDataToCalendar', 'render');
                courseCollection = {};
                this.engine.initialize();
            },

            engine: new Bloodhound(
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
                                    cr: course.classRoom,
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
            ),

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
                                that.addCourseItem(courseCollection[0].title, courseCollection[0].code);
                            }
                            that.addDataToCalendar(eventCal);
                    });
            },

            addCourseItem: function (courseName, courseCode) {
                var noppa = 'https://noppa.lut.fi/noppa/opintojakso/';
                $('#courseList').append('<li data-filtertext="' + courseName + '"><a href=' + noppa + courseCode + ' target="_blank">' + courseName + '</a></li>');
            },

            removeCourseItem: function (courseName, courseCode) {
                $('#courseList').remove('<li data-filtertext="' + courseName + '"><a href=' + noppa + courseCode + ' target="_blank">' + courseName + '</a></li>');
            },

            addDataToCalendar: function (calendar) {
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
            },

            render: function () {
                this.template = _.template(searchTemplate);
                this.$el.html(this.template({}));
                this.searchBox(new EventCalendarView());
                $('#courseSearchBox').focus();
                return this;
            }
        });

        return SearchView;

    });