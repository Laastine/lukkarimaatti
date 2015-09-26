var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Router = require('./router')

$.ajaxSetup({cache: true})
new Router()
Backbone.history.start({
    pushState: true,
    silent: true
})