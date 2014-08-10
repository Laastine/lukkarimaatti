define([
        "jquery",
        "underscore",
        "backbone"
    ],
    function ($, _, Backbone) {
        'use strict';

        // We need to keep the functionality of being able to bindAll to entire object w/out specifying each function name individually
        _.bindAll = function (obj) {
            var funcs = Array.prototype.slice.call(arguments, 1);
            if (funcs.length === 0) {
                funcs = _.functions(obj);
            }
            _.each(funcs, function (f) {
                if (f !== 'constructor' && f !== 'initialize') { // binding to the constructor / initialize is a dangerous practice that can cause problems
                    obj[f] = _.bind(obj[f], obj);
                }
            });
            return obj;
        };

        var app = {
            root: "/"
        };

        var environment = 'http://83.136.252.198/lukkarimaatti';

        $.ajaxSetup({ cache: true });

        $.ajaxPrefilter(function (options) {
            options.url = environment + options.url;
        });

        app.eventAggregator = _.extend({}, Backbone.Events);

        return app;
    });