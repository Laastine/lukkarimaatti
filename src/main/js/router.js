var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    HeaderView = require('./views/HeaderView'),
    FooterView = require('./views/FooterView'),
    SearchView = require('./views/SearchView')
Backbone.$ = $

module.exports = Backbone.Router.extend({

    initialize: function () {
        this.index()
    },

    routes: {
        "": "index"
    },

    index: function() {
        if (!this.headerView) {
            this.headerView = new HeaderView({})
            this.headerView.setElement($(".header")).render()
        }

        if(this.searchView) {
            this.currentView = new SearchView()
            this.currentView.setElement($('#searchbar')).render()
        }

        if (!this.footerView) {
            this.footerView = new FooterView({})
            this.footerView.setElement($("#footer")).render()
        }
    }
})