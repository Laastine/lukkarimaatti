LukkarimaattiModule = (function () {
    'use strict';

    var courses;

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
                minLength: 2
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
        ).on('typeahead:selected', function(evt, item) {
                addDataToCalendar();
            });
    };

    function addDataToCalendar() {

        function processCourse(course) {
            var weekNumber = JSON.parse('['+course.wn+']');
            weekNumber.forEach(processWeekNumbers);

            function processWeekNumbers(weekNumber) {
                var h = course.tof.split('-')[0] || 6;
                var date = moment().day(course.wd).week(weekNumber).hours(h).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
                ViewModule.createCalendarEvent(course, date);
            }
        }
        courses.forEach(processCourse);
    }

    $('#addButton').click(function () {
        addDataToCalendar();
    });

    return {
        engine: engine,
        searchBox: searchBox
    };

})();
