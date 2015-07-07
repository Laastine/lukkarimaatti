var Backbone = require('Backbone'),
    fullcalendar = require('fullcalendar'),
    $ = require('jquery')

var FooterView = Backbone.View.extend({

    template: _.template(FooterTemplate),   //TODO template

    render: function () {
        this.$el.html(this.template({}))
        return this
    }
})

module.exports = FooterView