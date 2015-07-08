var $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    SearchEngine = require('../SearchEngine'),
    EventCalendarView = require('./EventCalendarView'),
    template = require('../templates/search.hbs')
Backbone.$ = $

module.exports = Backbone.View.extend({
    calendar: new EventCalendarView(),

    initialize: function () {
        SearchEngine.engine.initialize()
        SearchEngine.getDataOnRefresh(this.calendar)
        this.render()
    },

    events: {
        "click #deleteButton": "deleteCourse"
    },

    sendLink: function (e) {
        SearchEngine.sendLink($(e.currentTarget).parent().children('#saveEmail').val())
    },

    deleteCourse: function (e) {
        var element = $(e.currentTarget).closest('tr')
        SearchEngine.removeCourseItem(element, element.attr('id'))
        this.calendar.removeCalendarEvent(element.attr('id'))
    },

    render: function () {
        SearchEngine.searchBox(this.calendar)
        $('#courseSearchBox').focus()
        $('#saveId').bind('click', this.sendLink)
        this.$el.html(template())
        return this
    }
})