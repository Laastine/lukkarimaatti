var LukkarimaattiModule = LukkarimaattiModule || {};

LukkarimaattiModule.main = (function () {
    'use strict';

    var courseNames, environment, noppa;
    courseNames = null;
    environment = 'http://83.136.252.198/lukkarimaatti';
    noppa = 'https://noppa.lut.fi/noppa/opintojakso/';

    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.url = environment + options.url;
    });

    $(document).ready(function () {
        LukkarimaattiModule.engine.initialize();
        LukkarimaattiModule.searchBox();
    });

})();
