var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone'),
    Router = require('./router')

$.ajaxSetup({cache: false})
new Router()
Backbone.history.start()