var $ = require('jquery')
    , _ = require('underscore'),
    Backbone = require('Backbone'),
    fullcalendar = require('fullcalendar')

var HeaderView = Backbone.View.extend({

    template: _.template('../templates/header.html'),

    render: function () {
        this.$el.html(this.template({}));
        return this;
    }
});

module.exports = HeaderView