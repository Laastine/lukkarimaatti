var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone'),
    Router = require('./router')

$.ajaxSetup({cache: false})
/*
$.ajaxPrefilter(function (options) {
    options.url = 'http://localhost:8080/lukkarimaatti' + options.url
})
*/
var router = new Router()
Backbone.history.start()