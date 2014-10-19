/* global require */
require.config({
    baseUrl: '/lukkarimaatti/app/dist',

    paths: {
        'jquery': 'lib/jquery/dist/jquery',
        'bootstrap': 'lib/bootstrap/dist/js/bootstrap',
        'fullcalendar': 'lib/fullcalendar/dist/fullcalendar',
        'underscore': 'lib/underscore/underscore',
        'backbone': 'lib/backbone/backbone',
        'handlebars': 'lib/handlebars/handlebars',
        'bloodhound': 'lib/typeahead.js/dist/bloodhound',
        'typeahead': 'lib/typeahead.js/dist/typeahead.bundle',
        'moment': 'lib/moment/min/moment-with-langs',
        'text': 'lib/text/text',

        'app': 'app',
        'router': 'router',
        'searchengine': 'SearchEngine',
        'eventcalendarview': 'views/EventCalendarView',
        'eventview': 'views/EventView',
        'headerview': 'views/HeaderView',
        'searchview': 'views/SearchView',
        'eventmodel': 'models/EventModel',
        "footerview": 'views/FooterView'
    },

    shim: {
        'bootstrap': { deps: ['jquery'] },
        'typeahead': { deps: ['jquery'] },
        'bloodhound': { deps: ['jquery'], exports: 'Bloodhound' },
        'handlebars': { exports: 'Handlebars' },
        'fullcalendar': { deps: ['jquery'], exports: 'fullCalendar' }
    },

    urlArgs: "bust=0.8.6"
});

require(['js/main']);

