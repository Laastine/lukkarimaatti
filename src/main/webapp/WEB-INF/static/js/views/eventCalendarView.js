define([
    'backbone',
    'fullcalendar',
    'js/views/eventView',
    'js/models/eventModel'
], function (Backbone, calendar, EventView, Event) {
    'use strict';

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
            console.log('calendar');
            var $context = $(this.el);
            $context.fullCalendar.apply($context, arguments);
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
                weekends: true,
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

        createCalendarEvent: function (course, dateStart, dateEnd) {
            console.log('createCalendarEvent='+course.title+', '+dateStart);

            var calendarEvent = {
                title: course.title + '/' + course.t,
                start: new Date(dateStart),
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

            if (!event.isValid()) {
                return false;
            }

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

    return EventCalendarView;

});