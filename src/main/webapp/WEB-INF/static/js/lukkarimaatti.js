var lukkarimaatti = (function () {
    'use strict';
    var courseNames, environment, noppa;
    courseNames = null;
    environment = "http://54.194.116.194:8085/lukkarimaatti";
    //environment = 'http://localhost:8085/lukkarimaatti';
    noppa = 'https://noppa.lut.fi/noppa/opintojakso/';

    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.url = environment + options.url;
    });

    $(function backbone() {

        var Event = Backbone.Model.extend({
            defaults: {
                title: "new",
                startDate: null,
                endDate: null,
                isAllDay: false,
                color: "rgb(0, 0, 0)"
            },
            validate: function (attrs) {
                if (attrs.endDate && attrs.endDate < attrs.startDate) {
                    return "Invalid end date.";
                }
                if (!attrs.title) {
                    return "Missing title.";
                }
                return null;
            }
        });

        var EventCollection = Backbone.Collection.extend({
            model: Event
        });

        var EventCalendarView = Backbone.View.extend({

            el: $('#calendar'),
            initialize: function () {
                _.bindAll(this, 'calendar', 'render', 'createCalendarEvent', 'addEvent', 'appendEvent');

                this.collection = new EventCollection();
                this.collection.bind('add', this.appendEvent);

                this.render();
            },
            calendar: function () {
                var $context = $(this.el);
                $context.fullCalendar.apply($context, arguments);
            },
            render: function () {
                var that = this;

                this.calendar({
                    header: {
                        left: 'prev, next today',
                        center: 'title',
                        right: 'month, agendaWeek, basicDay',
                        ignoreTimezone: false
                    },
                    defaultView: 'agendaWeek',
                    weekNumbers: true,
                    editable: true,
                    selectable: false,
                    selectHelper: true,
                    firstDay: 1,
                    dayClick: function (date, allDay, jsEvent, view) {
                        that.createCalendarEvent(date, allDay);
                    },
                    eventClick: function (event, jsEvent, view) {

                    },
                    eventRender: function (event, element, view) {
                        event.element = element; // Not known before
                    },
                    eventAfterRender: function (event, element, view) {
                        if (!event.view) {

                            event.submit = function (popover) {
                                event.title = popover.getEventTitle();
                                return that.addEvent(event);
                            };

                            event.discard = function (popover) {
                                that.calendar('removeEvents', function (e) {
                                    return event === e;
                                });
                                return true;
                            };
                        }
                    },
                    eventResize: function (event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
                        if (event.view && !event.view.synchronizeFromCalendar()) {
                            revertFunc();
                        }
                    },
                    eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
                        if (event.view && !event.view.synchronizeFromCalendar()) {
                            revertFunc();
                        }
                    }
                });

                // For re-rendering:
                _(this.collection.models).each(function (model) {
                    that.appendEvent(model);
                }, this);
            },

            createCalendarEvent: function (date, allDay) {
                var calendarEvent = {
                    title: "",
                    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), (date.getMinutes() >= 30 ? 30 : 0), 0),
                    end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1, (date.getMinutes() >= 30 ? 30 : 0), 0),
                    allDay: allDay,
                    element: null,
                    view: null,
                    id: _.uniqueId('e')
                };
                this.calendar('renderEvent', calendarEvent, true);
            },
            addEvent: function (calendarEvent) {
                var event = new Event();
                event.cid = calendarEvent.id;
                var eventView = this.appendEvent(event);
                eventView.synchronizeFromCalendar(calendarEvent);

                if (!event.isValid()) return false;

                this.collection.add(event, { silent: true }); // skipping "add" event since already rendered
                return event.save();
            },
            appendEvent: function (event) {
                var eventView = new EventView({
                    model: event,
                    calendar: this.calendar
                });
                return eventView;
            }
        });

        $(document).ready(function () {
            new EventCalendarView();
        });
    });

    $(function () {
        var engine = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/rest/cnames/%QUERY',
                    filter: function (response) {
                        // parsedResponse is the array returned from your backend
                        console.log(JSON.stringify(response));
                        return $.map(response, function (course) {
                                return {
                                    name: course.courseName,
                                    code: course.courseCode,
                                    data: response
                                };
                            }
                        );
                    }
                },
                limit: 5
            }
        );
        engine.initialize();
        var $searchBox = $('#courseSearchBox').typeahead({
                hint: true,
                highlight: true,
                minLength: 3
            },
            {
                name: 'courses',
                displayKey: 'name',
                source: engine.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Unable to find any courses that match the current query',
                        '</div>'
                    ].join('\n'),
                    suggestion: Handlebars.compile('<p><strong>{{name}}</strong> - {{code}}</p>')
                }
            }
        );
        $('form').submit(function (e) {
            console.log("submit");
            e.preventDefault(); // don't submit the form
            var course = $searchBox.val(); // get the current item
            console.log("searchBox=" + course);
            $('#courseList ul').append('<li>'+course+'</li>');
        });

    });

}());