require(['views/eventCalendarView', 'search', 'jquery', 'bootstrap'], function(EventCalendarView, search, $) {
    'use strict';

    var environment = 'http://localhost:8085/lukkarimaatti';

    $.ajaxSetup({ cache: false });          // force ajax call on all browsers

    $.ajaxPrefilter(function (options) {
        options.url = environment + options.url;
    });

    var eventCal = new EventCalendarView();
    $(document).ready(function () {
        search.engine.initialize();
        search.searchBox(eventCal);
        $('#courseSearchBox').focus();
    });
});
