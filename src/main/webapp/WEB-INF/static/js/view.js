define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    'use strict';

    var Event = Backbone.Model.extend({
        defaults: {
            title: 'tmp',
            startDate: null,
            endDate: null,
            isAllDay: false
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
            this.calendar = this.options.calendar;
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
            this.calendar('removeEvents', function (event) { return that.calendarEvent === event; });
            this.remove();
        },

        remove: function () {
            this.model.destroy();
        }
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
            var context = $(this.el);
            context.fullCalendar.apply(context, arguments);
        },

        render: function () {
            var that = this;
            this.calendar({
                header: {
                    left: 'prev, next today',
                    center: 'title',
                    right: 'month, agendaWeek, agendaDay',
                    ignoreTimezone: false
                },
                modal: true,
                weekends: false,
                defaultView: 'agendaWeek',
                weekNumbers: true,
                editable: true,
                selectable: false,
                selectHelper: true,
                firstDay: 1,
                minTime: 8,
                maxTime: 20,
                eventClick: function (event, jsEvent, view) {
                },
                eventRender: function (event, element, view) {
                    event.element = element;
                }
            });

            // For re-rendering:
            _(this.collection.models).each(function (model) {
                that.appendEvent(model);
            }, this);
        },

        createCalendarEvent: function(course, dateStart, dateEnd) {
            var calendarEvent = {
                title: course.title+'/'+course.t,
                start:  new Date(dateStart),
                end: new Date(dateEnd),
                allDay: false,
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

            if (!event.isValid()) { return false; }

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

    return {
        createEvent: function(course, dateStart, dateEnd) { EventCalendarView.createCalendarEvent(course, dateStart, dateEnd); }
    };
});