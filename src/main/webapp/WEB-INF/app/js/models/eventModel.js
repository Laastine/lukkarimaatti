/* global $, Backbone, define */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    'use strict';

    var EventModel = Backbone.Model.extend({
        defaults: {
            title:  '',
            description: '',
            start: '',
            end: '',
            allDay: false,
            element: null,
            view: null,
            id: ''
        },

        validate: function (attrs) {
            if (attrs.endDate && attrs.endDate < attrs.startDate) {
                return "Invalid end date.";
            }
            if (!attrs.title) {
                return "Missing title.";
            }
            return null;
        }
    });

    return EventModel;
});