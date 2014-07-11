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

            //Same goes with search view
            //          $(document).ready(function () {
            if (!this.searchView) {
                this.searchView = new SearchView();
                this.searchView.setElement($("#searchbar")).render();
            }
//            });

            //And EventCalendarView
/*
            if (!this.eventCalendarView) {
                this.eventCalendarView = new EventCalendarView();
                this.eventCalendarView.initialize();
            }

            */


            // Close and unbind any existing page view
            //if (this.currentView) { this.currentView.close(); }

            // Establish the requested view into scope
            this.currentView = view;

            // Render inside the page wrapper
            //$('#content').html(this.currentView.render().$el);
        },

        index: function () {
            // Fix for non-pushState routing (IE9 and below)
            this.show();

        }

    });

    return WebRouter;

});
