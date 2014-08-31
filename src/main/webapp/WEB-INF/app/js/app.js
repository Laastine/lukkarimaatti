define([
        "jquery",
        "underscore",
        "backbone"
    ],
    function ($, _, Backbone) {
        'use strict';

        _.bindAll = function (obj) {
            var funcs = Array.prototype.slice.call(arguments, 1);
            if (funcs.length === 0) {
                funcs = _.functions(obj);
            }
            _.each(funcs, function (f) {
                if (f !== 'constructor' && f !== 'initialize') {
                    obj[f] = _.bind(obj[f], obj);
                }
            });
            return obj;
        };

        var app = {
            root: "/"
        };

        var environment = 'http://localhost:8085/lukkarimaatti';

        $.ajaxSetup({ cache: false });

        $.ajaxPrefilter(function (options) {
            options.url = environment + options.url;
        });

        app.eventAggregator = _.extend({}, Backbone.Events);

        return app;
    });