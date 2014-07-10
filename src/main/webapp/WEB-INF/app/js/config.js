/* global require:false */

require.config({
    baseUrl: '/lukkarimaatti/app/js/',

    paths: {
        'jquery': 'lib/jquery/jquery',
        'jquery-ui': 'lib/jquery-ui/ui/jquery-ui',
        'bootstrap': 'lib/bootstrap/dist/js/bootstrap',
        'fullcalendar': 'lib/fullcalendar/fullcalendar',
        'underscore': 'lib/underscore/underscore',
        'backbone': 'lib/backbone/backbone',
        'handlebars': 'lib/handlebars/handlebars',
        'bloodhound': 'lib/typeahead.js/dist/bloodhound',
        'typeahead': 'lib/typeahead.js/dist/typeahead.bundle',
        'moment': 'lib/moment/min/moment-with-langs',
        'search': 'search',
        'view': 'view'
    },

    shim: {
        'bootstrap': { deps: ['jquery'] },
        'typeahead': { deps: ['jquery'] },
        'bloodhound': { deps: ['jquery'], exports: 'Bloodhound' },
        'handlebars': { exports: 'Handlebars' },
        'fullcalendar': { deps: ['jquery'], exports: 'fullCalendar'}
    }
});

require(['main']);

