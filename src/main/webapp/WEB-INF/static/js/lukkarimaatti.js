var LukkarimaattiModule = LukkarimaattiModule || {};

LukkarimaattiModule.main = (function () {
    'use strict';

    var environment = 'http://83.136.252.198/lukkarimaatti';

    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.url = environment + options.url;
    });

    $(document).ready(function () {
        LukkarimaattiModule.engine.initialize();
        LukkarimaattiModule.searchBox();
        $('#courseSearchBox').focus();
    });

})();
