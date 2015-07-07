var Backbone = require('Backbone'),
    fullcalendar = require('fullcalendar'),
    $ = require('jquery')

var HeaderView = Backbone.View.extend({

    template: _.template(HeaderTemplate),

    render: function () {
        this.$el.html(this.template({}));
        return this;
    }
});

module.exports = HeaderView