/**
 * @desc        backbone router for pushState page routing
 */

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

            // Every page view in the router should need a header.
            // Instead of creating a base parent view, just assign the view to this
            // so we can create it if it doesn't yet exist
            if (!this.headerView) {
                this.headerView = new HeaderView({});
                this.headerView.setElement($(".header")).render();
            }

            if (!this.searchView) {
                this.searchView = new SearchView();
                this.searchView.setElement($("#searchbar")).render();
            }
        },

        index: function () {
            this.show(new EventCalendarView());
        }

    });

    return WebRouter;

});
