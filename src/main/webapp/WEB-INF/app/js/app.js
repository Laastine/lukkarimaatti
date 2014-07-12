define([
        "jquery",
        "underscore",
        "backbone",
        "js/utils"
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
            root: "/",                      // The root path to run the application through.
            URL: "/",                       // Base application URL
            API: "/",                       // Base API URL (used by models & collections)

            // Show alert classes and hide after specified timeout
            showAlert: function (title, text, klass) {
                $("#header-alert").removeClass("alert-error alert-warning alert-success alert-info");
                $("#header-alert").addClass(klass);
                $("#header-alert").html('<button class="close" data-dismiss="alert">×</button><strong>' + title + '</strong> ' + text);
                $("#header-alert").show('fast');
                setTimeout(function () {
                    $("#header-alert").hide();
                }, 7000);
            }
        };

        var environment = 'http://localhost:8085/lukkarimaatti';

        $.ajaxSetup({ cache: false });          // force ajax call on all browsers

        $.ajaxPrefilter(function (options) {
            options.url = environment + options.url;
        });

        app.eventAggregator = _.extend({}, Backbone.Events);

        return app;
    });