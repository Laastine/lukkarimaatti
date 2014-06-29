/* global require:false */

require.config({
    baseUrl: '/lukkarimaatti/static',

    paths: {
        'jquery': 'js/lib/jquery/jquery',
        'jquery-ui': 'js/lib/jquery-ui/ui/jquery-ui',
        'jquery.bootstrap': 'js/lib/bootstrap/dist/js/bootstrap',
        'fullcalendar': 'js/lib/fullcalendar/fullcalendar',
        'underscore': 'js/lib/underscore-amd/underscore',
        'backbone': 'js/lib/backbone-amd/backbone',
        'handlebars': 'js/lib/handlebars/handlebars',
        'bloodhound': 'js/lib/typeahead.js/dist/bloodhound',
        'typeahead': 'js/lib/typeahead.js/dist/typeahead.bundle',
        'moment': 'js/lib/moment/moment',
        'app': 'js/app',
        'search': 'js/search',
        'view': 'js/view'
    },

    shim: {
        'jquery.bootstrap': { deps: ['jquery'] },
        'typeahead': { deps: ['jquery'] },
        'bloodhound': { deps: ['jquery'], exports: 'Bloodhound' },
        'handlebars': { exports: 'Handlebars' },
        'fullcalendar': { deps: ['jquery'], exports: 'fullCalendar'}
    }
});

require(['js/main'])

