require(['js/views/eventCalendarView', 'js/search'], function(EventCalendarView, search) {
    'use strict';
    // Just use GET and POST to support all browsers
    Backbone.emulateHTTP = true;

    new EventCalendarView();
    $(document).ready(function () {
        search.engine.initialize();
        search.searchBox();
        $('#courseSearchBox').focus();
    });

});
