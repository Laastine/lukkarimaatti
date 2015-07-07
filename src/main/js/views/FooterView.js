var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone'),
    fullcalendar = require('fullcalendar')

var
    FooterView = Backbone.View.extend({

        template: _.template('../templates/footer.html'),

        render: function () {
            this.$el.html(this.template({}))
            return this
        }
    })

module.exports = FooterView