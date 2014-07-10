require(['app', 'router'],
    function (app, WebRouter) {
        'use strict';

        // Just use GET and POST to support all browsers
        Backbone.emulateHTTP = true;

        app.router = new WebRouter();

        Backbone.history.start();
        var href = $(this).attr("href");
        app.router.navigate(href, { trigger: true, replace: false });

    });
