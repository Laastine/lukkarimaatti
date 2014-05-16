var LukkarimaattiModule = LukkarimaattiModule || {};

LukkarimaattiModule.main = (function () {
    'use strict';

    var courseNames, environment, noppa;
    courseNames = null;
    environment = 'http://localhost:8085/lukkarimaatti';
    noppa = 'https://noppa.lut.fi/noppa/opintojakso/';

    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.url = environment + options.url;
    });

    $(document).ready(function () {
        LukkarimaattiModule.engine.initialize();
        LukkarimaattiModule.searchBox();
    });

})();
