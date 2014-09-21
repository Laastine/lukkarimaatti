/* global Backbone, _, $, define */
define([
    'backbone',
    'fullcalendar',
    'eventview',
    'eventmodel'
], function (Backbone, calendar, EventView, EventModel) {
    'use strict';

    var eventSources = [];  //Contains deep copies of events

    var EventCalendarView = Backbone.View.extend({

        el: $('#calendar'),

        initialize: function () {
            _.bindAll(this, 'calendar', 'render', 'createCalendarEvent', 'addEvent', 'appendEvent', 'removeCalendarEvent');
            this.render();
        },

        removeCalendarEvent: function (code) {
            var index = -1;
            eventSources.forEach(function (e) {
                e.map(function (f) {
                    if (f.id.substring(0, f.id.indexOf('#')) === code) {
                        index = eventSources.indexOf(e);
                        return;
                    }
                });
            });
            if (index >= 0) {
                this.calendar('removeEventSource', { events: eventSources[index] });
                eventSources.splice(index, 1);
            }
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
                allDayDefault: false,
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
                    element.find('.fc-title').append("<br/>" + event.description);
                }
            });
        },

        createCalendarEvent: function (courseToBeAdded) {
            if (eventSources.length > 0) {
                eventSources[eventSources.length] = courseToBeAdded;
            } else {
                eventSources[0] = courseToBeAdded;
            }

            this.calendar('addEventSource', courseToBeAdded);
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