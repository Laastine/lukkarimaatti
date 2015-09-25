var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    template = require('../templates/footer.hbs')

module.exports = Backbone.View.extend({
    render: function() {
        this.$el.html(template());
        return this
    }
})