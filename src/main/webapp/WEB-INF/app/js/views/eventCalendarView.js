/* global Backbone, _, $, define */
define([
    'backbone',
    'fullcalendar',
    'eventview',
    'eventmodel'
], function (Backbone, calendar, EventView, EventModel) {
    'use strict';

    var array = [];

    var EventCalendarView = Backbone.View.extend({

        el: $('#calendar'),

        initialize: function () {
            _.bindAll(this, 'calendar', 'render', 'createCalendarEvent', 'addEvent', 'appendEvent', 'removeEvent');
            this.render();
        },

        removeEvent: function (code) {
            var that = this;
            array.filter(function (e) {
                return e.toString().substring(0, e.indexOf('#')) === code;
            }).forEach(function (e) {
                that.calendar('removeEvents', e);
            });
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
                    right: 'month, agendaWeek, agendaDay',
                    ignoreTimezone: false
                },
                titleFormat: {
                    month: 'MMMM',
                    week: 'DD.MM.YYYY',
                    day: 'DD.MM',
                    agenda: 'hh:mm'
                },
                allDaySlot: false,
                axisFormat: 'HH:mm',
                weekends: true,
                hiddenDays: [0],
                weekNumbers: true,
                firstDay: 1,
                minTime: '08:00:00',
                maxTime: '20:00:00',
                timeFormat: 'hh:mm',
                defaultView: 'agendaWeek',
                eventClick: function (event, jsEvent, view) {
                    that.calendar('removeEvents', event._id);
                },
                eventRender: function (event, element) {
                    event.element = element;
                    element.find('.fc-event-title').append("<br/>" + event.description);
                }
            });
        },

        createCalendarEvent: function (course, dateStart, dateEnd) {
            var that = this;
            var calendarEvent = {
                title: course.code,
                description: course.title + '/' + course.t + '\n' + course.cr,
                start: new Date(dateStart),
                end: new Date(dateEnd),
                allDay: false,
                element: null,
                view: null,
                id: course.code + '#' + course.t
            };
            array.push(calendarEvent.id);
            that.calendar('renderEvent', calendarEvent, true);
        },

        addEvent: function (calendarEvent) {
            var event = new EventModel();
            event.cid = calendarEvent.id;
            var eventView = this.appendEvent(event);
            eventView.synchronizeFromCalendar(calendarEvent);

            if (!event.isValid()) {
                return false;
            }

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