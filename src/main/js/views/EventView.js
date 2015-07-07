var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone'),
    fullcalendar = require('fullcalendar')

var EventView = Backbone.View.extend({

    calendar: null,
    calendarEvent: null,

    initialize: function () {
        _.bindAll(this, 'render', 'unrender', 'remove', 'synchronizeIntoCalendar', 'synchronizeFromCalendar')
        this.model.bind('remove', this.unrender)
        this.calendar = this.options.calendar
    },

    validate: function (attrs) {
        if (attrs.endDate && attrs.endDate < attrs.startDate) {
            return "Invalid end date."
        }
        if (!attrs.title) {
            return "Missing title."
        }
        if (!attrs.description) {
            return "Description title."
        }
        return null
    },

    synchronizeIntoCalendar: function () {
        var event = this.calendarEvent || (this.calendarEvent = {element: null})
        event.id = this.model.cid
        event.start = this.model.get('startDate')
        event.end = this.model.get('endDate')
        event.allDay = this.model.get('isAllDay')
        event.title = this.model.get('title')
        event.description = this.model.get('description')
        event.color = this.model.get('color')
        event.view = this
        return event
    },

    synchronizeFromCalendar: function (calendarEvent) {
        var event = this.calendarEvent = calendarEvent || this.calendarEvent
        return this.model.set({
            title: event.title,
            description: event.description,
            startDate: event.start,
            endDate: event.end,
            isAllDay: event.allDay,
            color: event.color
        })
    },

    render: function () {
        this.calendar('renderEvent', this.synchronizeIntoCalendar(), true)
        return this // For chaining
    },

    unrender: function () {
        var that = this
        this.calendar('removeEvents', function (event) {
            return that.calendarEvent === event
        })
        this.remove()
    },

    remove: function () {
        this.model.destroy()
    }
})

module.exports = EventView