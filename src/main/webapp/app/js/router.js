/* global define, $, _, Backbone */
define([
    "app",
    "eventmodel",
    "headerview",
    "footerview",
    "eventcalendarview",
    "searchview"
], function (app, EventModel, HeaderView, FooterView, EventCalendarView, SearchView) {
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

            if(!this.footerView) {
                this.footerView = new FooterView({});
                this.footerView.setElement($("#footer")).render();
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
