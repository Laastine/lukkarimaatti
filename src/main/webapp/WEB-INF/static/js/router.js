define([
    "app",
    "utils"
], function (app, SessionModel, UserModel, HeaderView, LoginPageView) {
    'use strict';

    var Router = Backbone.Router.extend({

        initialize: function () {
            _.bindAll(this);
        },

        routes: {
            "": "index"
        },

        index: function () {
            console.log('router: index');
        }

    });

    return Router;

});