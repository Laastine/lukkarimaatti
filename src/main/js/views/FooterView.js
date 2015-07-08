var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    template = require('../templates/footer.hbs')
Backbone.$ = $
module.exports =  Backbone.View.extend({
    initialize: function () {
        this.render()
    },
    render: function () {
        this.$el.html(template());
        return this
    }
})