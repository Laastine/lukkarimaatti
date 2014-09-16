/* global define, Backbone, $, _ */
define(['searchengine', 'eventcalendarview', 'text!templates/search.html'],
    function ( SearchEngine, EventCalendarView, searchTemplate) {
        'use strict';

        var calendar = new EventCalendarView();

        var SearchView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this, 'render');
                SearchEngine.engine.initialize();
                SearchEngine.refresh(calendar);
            },

            events: {
                "click #deleteButton": "deleteCourse"
            },

            sendLink: function (e) {
                SearchEngine.sendLink($(e.currentTarget).parent().children('#saveEmail').val());
            },

            deleteCourse: function (e) {
                var element = $(e.currentTarget).closest('tr');
                SearchEngine.removeCourseItem(element, element.attr('id'));
                calendar.removeEvent(element.attr('id'));
            },

            render: function () {
                this.template = _.template(searchTemplate);
                this.$el.html(this.template({}));
                SearchEngine.searchBox(calendar);
                $('#courseSearchBox').focus();
                $('#saveId').bind('click', this.sendLink);
                return this;
            }
        });

        return SearchView;

    });