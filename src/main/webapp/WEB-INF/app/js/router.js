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
            console.log('WebRouter');
        },

        routes: {
            "": "index"
        },

        show: function (view, options) {
            console.log('show');

            // Every page view in the router should need a header.
            // Instead of creating a base parent view, just assign the view to this
            // so we can create it if it doesn't yet exist
            if (!this.headerView) {
                this.headerView = new HeaderView({});
                this.headerView.setElement($(".header")).render();
            }
            console.log('1');
            //Same goes with search view
            if(!this.searchView) {
                this.searchView = new SearchView({});
                this.searchView.setElement($(".container")).render();
            }

            //And



            console.log('1');
            // Close and unbind any existing page view
            if (this.currentView) { this.currentView.close(); }

            // Establish the requested view into scope
            this.currentView = view;

            // Render inside the page wrapper
            //$('#content').html(this.currentView.render().$el);
        },

        index: function () {
            console.log('index');

            // Fix for non-pushState routing (IE9 and below)
            var hasPushState = !!(window.history && history.pushState);
            if (!hasPushState) {
                this.navigate(window.location.pathname.substring(1),
                    {trigger: true, replace: true});
            } else {
                this.show(new EventCalendarView());
            }

        }

    });

    return WebRouter;

});
