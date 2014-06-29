define([
        "jquery",
        "underscore",
        "backbone"
    ],
    function ($, _, Backbone) {
        'use strict';
        var environment = 'http://localhost:8085/lukkarimaatti';

        var app = {
            root: "/",                     // The root path to run the application through.
            URL: "/",                      // Base application URL
            API: "/api"                   // Base API URL (used by models & collections)
        };

        $.ajaxSetup({ cache: false });          // force ajax call on all browsers

        $.ajaxPrefilter(function (options) {
            options.url = environment + options.url;
        });

        // Global event aggregator
        app.eventAggregator = _.extend({}, Backbone.Events);

        return app;

    });
