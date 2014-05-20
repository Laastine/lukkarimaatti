LukkarimaattiModule = (function () {
    'use strict';

    var courses;

    var view = {};

    var engine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/rest/cnames/%QUERY',
                filter: function (response) {
                    // parsedResponse is the array returned from your backend
                    console.log(JSON.stringify(response));
                    courses = $.map(response, function (course) {
                        return {
                            title: course.courseName,
                            code: course.courseCode,
                            tof: course.timeOfDay,
                            wd: course.weekDay,
                            wn: course.weekNumber,
                            cr: course.classRoom,
                            t: course.type
                        };
                    });

                    return _.uniq(courses, function(item) {
                        return item.title + item.code;
                    });
                }
            },
            limit: 10
        }
    );

    var searchBox = function () {
        $('#courseSearchBox').typeahead({
                hint: true,
                highlight: true,
                minLength: 3
            },
            {
                name: 'courses',
                displayKey: 'name',
                source: engine.ttAdapter(),
                templates: {
                    empty: [
                        '<p><strong>',
                        'Unable to find any courses that match the current query',
                        '</strong></p>'
                    ].join('\n'),
                    suggestion: Handlebars.compile('<p><strong>{{title}}</strong> - {{code}}</p>')
                }
            }
        );
    };

    $('#addButton').click(function () {
        function processCourse(course) {
            var h = course.tof.split('-')[0] || 6;
            var date = moment().day(course.wd || 'su').week(course.wn || '21').hours(h).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
            console.log('date=' + date);
            ViewModule.createCalendarEvent(course, date);
        }

        courses.forEach(processCourse);
    });

    return {
        engine: engine,
        searchBox: searchBox
    };

})();
