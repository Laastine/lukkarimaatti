var Backbone = require('Backbone'),
    fullcalendar = require('fullcalendar'),
    EventView = require('./EventView'),
    EventModel = require('../models/EventModel')

var eventSources = []

var EventCalendarView = Backbone.View.extend({

    el: $('#calendar'),

    initialize: function () {
        _.bindAll(this, 'calendar', 'render', 'createCalendarEvent', 'addEvent', 'appendEvent', 'removeCalendarEvent')
        this.render()
    },

    removeCalendarEvent: function (code) {
        var index = -1
        eventSources.forEach(function (e) {
            e.map(function (f) {
                if (f.id.substring(0, f.id.indexOf('#')) === code) {
                    index = eventSources.indexOf(e)
                    return
                }
            })
        })
        if (index >= 0) {
            this.calendar('removeEventSource', {events: eventSources[index]})
            eventSources.splice(index, 1)
        }
    },

    calendar: function () {
        var $context = $(this.el)
        $context.fullCalendar.apply($context, arguments)
    },

    render: function () {
        var that = this
        this.calendar({
            header: {
                left: 'prev, next today',
                center: 'title',
                right: 'month, agendaWeek, agendaDay',
                ignoreTimezone: false
            },
            titleFormat: {
                month: 'MMMM YYYY',
                week: 'DD.MM.YYYY',
                day: 'DD.MM',
                agenda: 'hh:mm'
            },
            columnFormat: 'ddd M.D',
            allDaySlot: false,
            axisFormat: 'HH:mm',
            weekends: true,
            contentHeight: 550,
            allDayDefault: false,
            hiddenDays: [0],
            weekNumbers: true,
            firstDay: 1,
            minTime: '08:00:00',
            maxTime: '20:00:00',
            timeFormat: 'hh:mm',
            defaultView: 'agendaWeek',
            eventClick: function (event) {
                that.calendar('removeEvents', event._id)
            },
            eventRender: function (event, element) {
                event.element = element
                element.find('.fc-title').append("<br/>" + event.description)
            }
        })
    },

    createCalendarEvent: function (courseToBeAdded) {
        eventSources[eventSources.length] = courseToBeAdded
        this.calendar('addEventSource', courseToBeAdded)
    },

    addEvent: function (calendarEvent) {
        var event = new EventModel()
        event.cid = calendarEvent.id
        var eventView = this.appendEvent(event)
        eventView.synchronizeFromCalendar(calendarEvent)

        if (!event.isValid()) {
            return false
        }

        return event.save()
    },

    appendEvent: function (event) {
        return new EventView({
            model: event,
            calendar: this.calendar
        })
    }
})

module.exports = EventCalendarView