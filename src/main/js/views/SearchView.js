var Backbone = require('backbone')
    SearchEngine = require('../SearchEngine'),
    EventCalendarView = require('./EventCalendarView')

var SearchView = Backbone.View.extend({
    calendar: new EventCalendarView(),

    initialize: function () {
        _.bindAll(this, 'render')
        SearchEngine.engine.initialize()
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
        this.template = _.template('../templates/search.html')
        this.$el.html(this.template({}))
        SearchEngine.searchBox(calendar)
        $('#courseSearchBox').focus()
        $('#saveId').bind('click', this.sendLink)
        return this
    }
})

module.exports = SearchView