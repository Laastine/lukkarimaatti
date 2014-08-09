define([
    "app",
    "text!templates/header.html",
    "jquery",
    "bootstrap"
], function (app, HeaderTpl) {
    'use strict';

    var HeaderView = Backbone.View.extend({

        template: _.template(HeaderTpl),

        render: function () {
            this.$el.html(this.template({}));
            return this;
        }
    });

    return HeaderView;
});