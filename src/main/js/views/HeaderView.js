var $ = require('jquery')(window),
    _ = require('underscore'),
    Backbone = require('backbone'),
    template = require('../templates/header.hbs')
Backbone.$ = $

module.exports =  Backbone.View.extend({

    template: _.template('/templates/header.html'),

    render: function () {
        this.$el.html(template());
        return this;
    }
});
