define(['searchengine', 'eventcalendarview', 'text!templates/search.html'],
    function ( SearchEngine, EventCalendarView, searchTemplate) {
        'use strict';


        var SearchView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this, 'render');
                SearchEngine.engine.initialize();
            },

            render: function () {
                this.template = _.template(searchTemplate);
                this.$el.html(this.template({}));
                SearchEngine.searchBox(new EventCalendarView());
                $('#courseSearchBox').focus();
                return this;
            }
        });

        return SearchView;

    });