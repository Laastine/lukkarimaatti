var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    EventModel = require('./models/EventModel'),
    HeaderView = require('./views/HeaderView'),
    FooterView = require('./views/FooterView'),
    EventCalendarView = require('./views/EventCalendarView'),
    SearchView = require('./views/SearchView')

var Router = Backbone.Router.extend({

    initialize: function () {
        _.bindAll(this, 'show', 'index')
    },

    routes: {
        "": "index"
    },

    show: function (view, options) {

        if (!this.headerView) {
            this.headerView = new HeaderView({})
            this.headerView.setElement($(".header")).render()
        }

        if (!this.footerView) {
            this.footerView = new FooterView({})
            this.footerView.setElement($("#footer")).render()
        }

        if (this.currentView) {
            this.currentView.close()
        }
        this.currentView = view
        this.currentView.setElement($("#searchbar")).render()
    },

    index: function () {
        this.show(new SearchView())
    }

})

module.exports = Router