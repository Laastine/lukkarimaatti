
define(['backbone'], function(Backbone) {
    'use strict';

    var EmailModel = Backbone.Model.extend({
        defaults: {
            email: ''
        },

        validate: function (attrs) {
            var regex = /^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/igm;
            if (attrs === '' || !regex.test(attrs) ) {
                return "Invalid email address";
            }
            return null;
        }
    });

    return EmailModel;
});