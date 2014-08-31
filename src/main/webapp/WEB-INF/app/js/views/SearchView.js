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
                var ele = $(e.target).closest('tr');
                console.log('delete id='+ele);
                SearchEngine.onClickDelete(ele);
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