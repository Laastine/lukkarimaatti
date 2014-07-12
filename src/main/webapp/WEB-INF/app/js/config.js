/* global require:false */

require.config({
    baseUrl: '/lukkarimaatti/app/dist/js/',

    paths: {
        'jquery': 'lib/jquery/dist/jquery',
        'jquery-ui': 'lib/jquery-ui/ui/jquery-ui',
        'bootstrap': 'lib/bootstrap/dist/js/bootstrap',
        'fullcalendar': 'lib/fullcalendar/dist/fullcalendar',
        'underscore': 'lib/underscore/underscore',
        'backbone': 'lib/backbone/backbone',
        'handlebars': 'lib/handlebars/handlebars',
        'bloodhound': 'lib/typeahead.js/dist/bloodhound',
        'typeahead': 'lib/typeahead.js/dist/typeahead.bundle',
        'moment': 'lib/moment/min/moment-with-langs',
        'text': 'lib/text/text'
    },

    shim: {
        'bootstrap': { deps: ['jquery'] },
        'typeahead': { deps: ['jquery'] },
        'bloodhound': { deps: ['jquery'], exports: 'Bloodhound' },
        'handlebars': { exports: 'Handlebars' },
        'fullcalendar': { deps: ['jquery'], exports: 'fullCalendar' }
    }
});

require(['main']);
