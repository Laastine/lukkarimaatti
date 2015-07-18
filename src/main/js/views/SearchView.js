var $ = require('jquery'),
    _ = require('underscore'),
    SearchEngine = require('../SearchEngine'),
    EventCalendarView = require('./EventCalendarView'),
    Backbone = require('backbone'),
    template = require('../templates/search.hbs')

global.jQuery = $;

module.exports = Backbone.View.extend({
    calendar: new EventCalendarView(),

    initialize: function () {
        SearchEngine.searchBox(this.calendar)
        SearchEngine.getDataOnRefresh(this.calendar)
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
        this.$el.html(template())
        SearchEngine.searchBox(this.calendar)
        $('#courseSearchBox').focus()
        $('#saveId').bind('click', this.sendLink)
        return this
    }
})