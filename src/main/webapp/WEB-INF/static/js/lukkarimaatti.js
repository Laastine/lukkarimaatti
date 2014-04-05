var lukkarimaatti = (function () {
    "use strict";
    var selectedCourses, selectedCoursesArray, sidebarList, timetable, username, logged, courseNames, loaded,
        environment, noppa;
    selectedCourses = [];
    selectedCoursesArray = [];
    sidebarList = $("#sidebar_list_of_courses");
    timetable = $('#timetable');
    username = "Oskari Omena";
    logged = true;
    courseNames = null;
    loaded = false;
    //environment = "http://54.194.116.194:8085";
    environment = "http://localhost:8085";
    noppa = "https://noppa.lut.fi/noppa/opintojakso/";

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

    (function getCourseData() {
        var data;
        if (!loaded) {
            data = JSON.stringify(makeAjaxRequest(environment + '/lukkarimaatti/rest/all'));
            loaded = true;
        } else {
            console.log("courseNames=" + document.cookie);
        }
        return data;
    });

    $(document).ready(function () {
        drawTable();
        $('#courseSearchBox').focus();
        if (logged) {
            $('#nav_login').fadeOut(1000, function () {
                $('#nav_user_name').fadeIn(1000).text(username);
            });
        }
    });

    function updateCourseList() {
        console.log("updateCourseList");
        sidebarList.empty();
        for (var i = 0; i < selectedCourses.length; i++) {
            $('#sidebar_list_of_courses').append('<li id=' + selectedCourses[i] + ' class="list-group-item lukkarimaatti_search_list_item"><span class="design" > </span>' + selectedCourses[i] + '</li>'); //Slow!
        }
        var item = sidebarList.find("li").last();
        $(item[0]).hide().fadeIn(200);
// makeSidebarItemsRemovable();

        $("li.lukkarimaatti_search_list_item").click(function () {
            $(this).fadeOut('slow', function () {
                var selectedCourseIndex = selectedCourses.indexOf(this.id);

                for (var index = selectedCoursesArray.length - 1; index >= 0; index--) {
                    if (selectedCoursesArray[index].courseName === selectedCourses[selectedCourseIndex]) {
                        selectedCoursesArray.splice(index, 1);
                    }
                }

                if (selectedCourseIndex > -1) {
                    selectedCourses.splice(selectedCourseIndex, 1);
                }
                drawTable();
            });
        });
    }

    function drawTable() {
        var dates = ["monday", "tuesday", "wednesday", "thursday", "friday"];
        var lectureTimes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        var row, tr, checkItem;

        timetable.find("> tbody > tr").remove();
        jQuery.each(lectureTimes, function (lectureIndex) {
            row = timetable.find('> tbody:last');
            row.append('<tr>');
            tr = timetable.find('> tbody:last > tr:last');
            tr.append($('<td id="' + lectureTimes[lectureIndex] + '">').text(lectureTimes[lectureIndex] + "-" + (lectureTimes[lectureIndex] + 1)));

            jQuery.each(dates, function (dateIndex, dateValue) {
                // lookupForTableItem searches courseItem based on time (e.g. we10 == Wednesday at 10 a clock) from selectedCoursesArray
                checkItem = lookupForTableItem(dateValue + lectureTimes[lectureIndex]);

                if (checkItem != null) {
                    tr.append($('<td class="hoverclass" id="' + (checkItem.courseCode) + '">').text(checkItem.courseCode + "/").append($('<p style="margin: 0px">').text(checkItem.courseName)));
                } else {
                    tr.append($('<td class="hoverclass" id="XX00Y0000">').text("--"));
                }
            });
        });
    }

    function downloadCourseInfo(course) {
        console.log("downloadCourseInfo");
        var items = [];
        $.getJSON(environment + "/lukkarimaatti/rest/name/" + course, "", function (data) {
            $.each(data, function (key, val) {
                items.push(val);
            });
            console.log("items=" + items);
            createCourseObjectFromJsonObject(items)
            drawTable();
        });
    }

    function lookupForTableItem(position) {
        selectedCourses.forEach(function(entry) {
        //for (var i = 0, len = selectedCoursesArray.length; i < len; i++) {
            if (entry.position.courseName.toLowerCase() === position.toLowerCase()) {
                console.log("debug=" + typeof entry.position)
                return entry;
            }
        });
    }

    function login() {
    }

    function createCourseObjectFromJsonObject(fetchedItems) {
        $.each(fetchedItems, function (index, course_to_process) {
            selectedCoursesArray[selectedCoursesArray.length] = JSON.stringify(course_to_process);
            console.log("stringify=" + selectedCoursesArray);
        });
    }

    $(function () {
        var $searchBox = $('#courseSearchBox').typeahead({
            minLength: 3,
            highlight: true,
            name: 'Courses',
            dataType: 'json',
            maxParallelRequests: 3,
            rateLimitWait: 1000,
            remote: {
                url: environment + '/lukkarimaatti/rest/names/%QUERY',
                filter: function (parsedResponse) {
                    // parsedResponse is the array returned from your backend
                    console.log(parsedResponse);

                    // do whatever processing you need here
                    return parsedResponse;
                }
            }
        });
        $('form').submit(function (e) {
            e.preventDefault(); // don't submit the form
            var course = $searchBox.val(); // get the current item
            console.log("searchBox=" + course);
            var itemInCourseList = selectedCourses.some(function (entry) {
                return entry === course;
            });
            if (!itemInCourseList) {
                console.log("!itemInCourseList" + course)
                selectedCourses.push(course); // add course to the source
                updateCourseList(); // refresh the list
                downloadCourseInfo(course);
            } else {
                alert("Course " + course + " is already selected!");
            }
            $searchBox.val(""); // clean the input
            // This clear last query away.
            // Otherwise last item will appear pretyped to searchbox if mouse click happens in page
            $searchBox.typeahead('setQuery', '');
        });
    });

}());