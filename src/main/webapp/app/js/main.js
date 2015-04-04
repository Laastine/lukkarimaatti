/* global require, $, Backbone */
require(['app', 'router'],
    function (app, WebRouter) {
        'use strict';

        app.router = new WebRouter();
        Backbone.history.start();
        var href = $(this).attr("href");
        app.router.navigate(href, {trigger: true, replace: false});
    });
