define(['searchengine', 'eventcalendarview', 'text!templates/search.html'],
    function ( SearchEngine, EventCalendarView, searchTemplate) {
        'use strict';

        var calendar = new EventCalendarView();

        var SearchView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this, 'render');
                SearchEngine.engine.initialize();
                SearchEngine.onPageLoad(calendar);
            },

            events: {
                "click #deleteButton": "deleteCourse"
            },

            deleteCourse: function (e) {
                var element = $(e.currentTarget).closest('tr');
                SearchEngine.onClickDelete(element, element.attr('id'));
            },

            render: function () {
                this.template = _.template(searchTemplate);
                this.$el.html(this.template({}));
                SearchEngine.searchBox(calendar);
                $('#courseSearchBox').focus();
                return this;
            }
        });

        return SearchView;

    });