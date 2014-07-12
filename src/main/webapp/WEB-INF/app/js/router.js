define([
    "app",
    "models/EventModel",
    "views/HeaderView",
    "views/EventCalendarView",
    "views/SearchView",
    "utils"
], function (app, EventModel, HeaderView, EventCalendarView, SearchView) {
    'use strict';

    var WebRouter = Backbone.Router.extend({

        initialize: function () {
            _.bindAll(this, 'show', 'index');
        },

        routes: {
            "": "index"
        },

        show: function (view, options) {

            if (!this.headerView) {
                this.headerView = new HeaderView({});
                this.headerView.setElement($(".header")).render();
            }

            if (this.currentView) { this.currentView.close(); }
            this.currentView = view;
            this.currentView.setElement($("#searchbar")).render();
        },

        index: function () {
            this.show(new SearchView());
        }

    });

    return WebRouter;
});
