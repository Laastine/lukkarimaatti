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

            initialize: function () {
                console.log('Model loaded');
            },

            defaults: {
                title: "new",
                startDate: null,
                endDate: null,
                isAllDay: false,
                color: "rgb(81, 183, 73)"
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

        var EventView = Backbone.View.extend({

            calendar: null,
            calendarEvent: null,

            initialize: function () {
                _.bindAll(this, 'render', 'unrender', 'remove', 'synchronizeIntoCalendar', 'synchronizeFromCalendar');

                this.model.bind('change', this.render);
                this.model.bind('remove', this.unrender);

                this.calendar = this.options['calendar'];
            },

            synchronizeIntoCalendar: function () {
                var e = this.calendarEvent || (this.calendarEvent = { element: null });
                e.id = this.model.cid;
                e.start = this.model.get('startDate');
                e.end = this.model.get('endDate');
                e.allDay = this.model.get('isAllDay');
                e.title = this.model.get('title');
                e.color = this.model.get('color');
                e.view = this;
                return e;
            },

            synchronizeFromCalendar: function (calendarEvent) {
                var e = this.calendarEvent = calendarEvent || this.calendarEvent;
                return this.model.set({
                    title: e.title,
                    startDate: e.start,
                    endDate: e.end,
                    isAllDay: e.allDay,
                    color: e.color
                });
            },

            render: function () {
                this.calendar('renderEvent', this.synchronizeIntoCalendar(), true);
                return this; // For chaining
            },

            unrender: function () {
                var that = this;

                this.calendar('removeEvents', function (event) {
                    return that.calendarEvent === event;
                });
                this.remove();
            },

            remove: function () {
                this.model.destroy();
            }
        });

        var EventCalendarView = Backbone.View.extend({

            el: $('#calendar-container'),

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
                    url: '/rest/names/%QUERY',
                    filter: function (parsedResponse) {
                        // parsedResponse is the array returned from your backend
                        console.log(parsedResponse);
                        return _.map(parsedResponse, function (name) {
                                return { value: name };
                            }
                        );
                    }
                },
                limit: 5
            }
        );
        engine.initialize();
        $('#courseSearchBox').typeahead({
                hint: true,
                highlight: true,
                minLength: 3
            },
            {
                displayKey: 'value',
                source: engine.ttAdapter(),
                template: [
                    '<div class="empty-message">',
                    'unable to find any courses that match the current query',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile('<p><strong>{{value}}</strong></p>')
            }
        );
    });

}());