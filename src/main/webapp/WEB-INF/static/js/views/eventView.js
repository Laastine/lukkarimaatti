define([
    'backbone'
], function (Backbone) {
    'use strict';

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
            this.calendar('removeEvents', function (event) {
                return that.calendarEvent === event;
            });
            this.remove();
        },

        remove: function () {
            this.model.destroy();
        }
    });

    return EventView;

});