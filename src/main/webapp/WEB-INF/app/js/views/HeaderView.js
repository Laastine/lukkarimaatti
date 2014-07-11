define([
    "app",
    "text!templates/header.html",
    "utils"
], function (app, HeaderTpl) {
    'use strict';

    var HeaderView = Backbone.View.extend({

        template: _.template(HeaderTpl),

        events: {
            "click a #aboutModalButton": "onClickAboutModal",
            "click a #contactModalButton": "onClickContactModal",
            "click a #saveModalButton": "onClickSaveModal"
        },

        render: function () {
            this.$el.html(this.template({}));
            return this;
        }
    });

    return HeaderView;
});