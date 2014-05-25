LukkarimaattiModule = (function () {
    'use strict';

    var courses = {};

    var engine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/rest/cnames/%QUERY',
                filter: function (response) {
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

                    return _.uniq(courses, function (item) {
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
        ).on('typeahead:selected', function (evt, item) {
                courses = courses.filter(function (el) {
                    return el.code === item.code;
                });
                if (courses[0].title.length != 0) {
                    addItem(courses[0].title, courses[0].code);
                }
                addDataToCalendar();
            });
    };


    var addItem = function (courseName, courseCode) {
        var noppa = 'https://noppa.lut.fi/noppa/opintojakso/';
        $("#courseList").append('<li data-filtertext="' + courseName + '"><a href=' + noppa + courseCode + ' target="_blank">' + courseName + '</a></li>');
    }

    function addDataToCalendar() {

        function processCourse(course) {
            var weekNumber = JSON.parse('[' + course.wn + ']');
            weekNumber.forEach(processWeekNumbers);

            function processWeekNumbers(weekNumber) {
                var hStart = course.tof.split('-')[0] || 6;
                var hEnd = course.tof.split('-')[0] || 6;
                var dateStart = moment().day(course.wd).week(weekNumber).hours(hStart).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
                var dateEnd = moment().day(course.wd).week(weekNumber).hours(hEnd).minutes(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
                ViewModule.createCalendarEvent(course, dateStart, dateEnd);
            }
        }

        courses.forEach(processCourse);
    }

    return {
        engine: engine,
        searchBox: searchBox
    };

})();
