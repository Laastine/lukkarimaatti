var lukkarimaatti = (function () {
    'use strict';
    var courseNames, environment, noppa;
    courseNames = null;
    environment = "http://54.194.116.194:8085";
    //environment = 'http://localhost:8085';
    noppa = 'https://noppa.lut.fi/noppa/opintojakso/';

    function makeAjaxRequest(url) {
        var httpRequest;
        if (window.XMLHttpRequest) { //Proper browser like ff and chrome
            httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) { //IE...
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    console.log(e);
                }
            }
        }
        if (!httpRequest) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    console.log('AJAX prefetch OK');
                    courseNames = httpRequest.responseText;
                } else {
                    console.log('There was a problem with the request.');
                }
            }
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    }

    $(document).ready(function () {
        $('#courseSearchBox').focus();
    });

    function downloadCourseInfo(course) {
        console.log("downloadCourseInfo");
        var items = [];
        $.getJSON(environment + '/lukkarimaatti/rest/name/' + course, '', function (data) {
            $.each(data, function (key, val) {
                items.push(val);
            });
            console.log("items=" + items);
            createCourseObjectFromJsonObject(items)
            drawTable();
        });
    }

    function createCourseObjectFromJsonObject(fetchedItems) {
            console.log("stringify=" + JSON.stringify(fetchedItems));
    }

    $(function () {
        var engine = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: environment + '/lukkarimaatti/rest/names/%QUERY',
                    filter: function (parsedResponse) {
                        // parsedResponse is the array returned from your backend
                        console.log(parsedResponse);
                        return _.map(parsedResponse, function (name) {
                                return { value: name };
                            }
                        );
                    }
                },
                limit: 5
            }
        );
        engine.initialize();
        $('#courseSearchBox').typeahead({
                hint: true,
                highlight: true,
                minLength: 3
            },
            {
                displayKey: 'value',
                source: engine.ttAdapter(),
                template: [
                    '<div class="empty-message">',
                    'unable to find any courses that match the current query',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile('<p><strong>{{value}}</strong></p>')
            }
        );
    });

}());