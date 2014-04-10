var lukkarimaatti = (function () {
    'use strict';
    var courseNames, environment, noppa;
    courseNames = null;
    //environment = "http://54.194.116.194:8085";
    environment = 'http://localhost:8085';
    noppa = 'https://noppa.lut.fi/noppa/opintojakso/';

    $(document).ready(function () {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            defaultView: 'basicWeek',
            editable: true
        });
    });

    function downloadCourseInfo(course) {
        console.log("downloadCourseInfo");
        var items = [];
        $.getJSON(environment + '/lukkarimaatti/rest/name/' + course, '', function (data) {
            $.each(data, function (key, val) {
                items.push(val);
            });
            console.log("items=" + items);
            createCourseObjectFromJsonObject(items);
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