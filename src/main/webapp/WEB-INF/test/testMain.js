var tests = [];
for (var file in window.__karma__.files) {

    if (/Spec\.js$/.test(file)) {
        tests.push(file.replace(/^\/base\//, 'http://localhost:9876/base/'));
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: 'http://localhost:9876/base/app/js/',

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

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});

