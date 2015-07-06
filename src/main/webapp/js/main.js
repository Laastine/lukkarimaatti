var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    router = require('./router')

var Main = {
    init: function () {
        $.ajaxSetup({cache: false})

        $.ajaxPrefilter(function (options) {
            options.url = 'http://localhost:8080/lukkarimaatti' + options.url
        })
        Backbone.history.start()
        var href = $(this).attr("href")
        router.navigate(href, {trigger: true, replace: false})
    }
}

module.exports = Main