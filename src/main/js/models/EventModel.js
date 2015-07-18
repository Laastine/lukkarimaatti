var $ = require('jquery'),
    Backbone = require('Backbone'),
    _ = require('underscore')
Backbone.$ = $

module.exports =  Backbone.Model.extend({
    defaults: {
        title: '',
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
            return "Invalid end date."
        }
        if (!attrs.title) {
            return "Missing title."
        }
        return null
    }
})