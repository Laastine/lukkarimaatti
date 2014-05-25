var LukkarimaattiModule = LukkarimaattiModule || {};

LukkarimaattiModule.main = (function () {
    'use strict';

    var environment = 'http://localhost:8085/lukkarimaatti';

    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.url = environment + options.url;
    });

    $(document).ready(function () {
        LukkarimaattiModule.engine.initialize();
        LukkarimaattiModule.searchBox();
        $('#courseSearchBox').focus();
    });

})();
