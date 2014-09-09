/* global define, Backbone, _, $*/
define([
    "app",
    "text!templates/header.html",
    "jquery",
    "bootstrap"
], function (app, HeaderTemplate) {
    'use strict';

    var HeaderView = Backbone.View.extend({

        template: _.template(HeaderTemplate),

        render: function () {
            this.$el.html(this.template({}));
            return this;
        }
    });

    return HeaderView;
});