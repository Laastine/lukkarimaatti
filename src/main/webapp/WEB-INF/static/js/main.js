require(['js/views/eventCalendarView', 'js/search'], function(EventCalendarView, search) {
    'use strict';

    var environment = 'http://83.136.252.198/lukkarimaatti';

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
