/* global jasmine, define, Backbone, _, $*/
define([
    "app",
    "text!templates/footer.html",
    "jquery",
    "bootstrap"
], function (app, FooterTemplate) {
    'use strict';

    var FooterView = Backbone.View.extend({

        template: _.template(FooterTemplate),

        render: function () {
            this.$el.html(this.template({}));
            return this;
        }
    });

    return FooterView;
});