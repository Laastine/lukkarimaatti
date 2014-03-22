var selectedCourses = [];
var selectedCoursesArray = [];
var sidebarList = $("#sidebar_list_of_courses");
var timetable = $('#timetable');
var username = "John Doe";
var logged = true;
var courseNames = null;

if(document.cookie === null) {
    console.log("AJAX res=");    //Prefetch course names
    document.cookie = JSON.stringify(makeAjaxRequest('http://localhost:8085/lukkarimaatti/rest/all'));
} else {
    console.log("courseNames="+document.cookie);
}

$(document).ready(function () {
    drawTable();
    $('#courseSearchBox').focus();
    if (logged) {
        $('#nav_login').fadeOut(1000, function () {
            $('#nav_user_name').fadeIn(1000).text(username);
        });
    }
});

function makeAjaxRequest(url) {
    var httpRequest;
    if (window.XMLHttpRequest) { //Proper browser like ff and chrome
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { //IE...
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {
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
};


function updateCourseList() {
    sidebarList.empty();
    for (var i = 0; i < selectedCourses.length; i++) {
        $('#sidebar_list_of_courses').append('<li id=' + selectedCourses[i] + ' class="list-group-item lukkarimaatti_search_list_item"><span class="design" > </span>' + selectedCourses[i] + '</li>'); //Slow!
    }
    var item = sidebarList.find("li").last();
    $(item[0]).hide().fadeIn(200);
//    makeSidebarItemsRemovable();

    $("li.lukkarimaatti_search_list_item").click(function () {
        $(this).fadeOut('slow', function () {
            var selectedCourseIndex = selectedCourses.indexOf(this.id);

            for (var index = selectedCoursesArray.length - 1; index >= 0; index--) {
                if (selectedCoursesArray[index].courseCode === selectedCourses[selectedCourseIndex]) {
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

    timetable.find("> tbody > tr").remove();
    $.each(lectureTimes, function (lectureIndex) {
        var row = timetable.find('> tbody:last');
        row.append('<tr>');
        var tr = timetable.find('> tbody:last > tr:last');
        tr.append($('<td id="' + lectureTimes[lectureIndex] + '">').text(lectureTimes[lectureIndex] + "-" + (lectureTimes[lectureIndex] + 1)));

        $.each(dates, function (dateIndex, dateValue) {
            // lookupForTableItem searches courseItem based on time (e.g. we10 == wednesday at 10 a clock) from selectedCoursesArray
            var checkItem = lookupForTableItem(dateValue + lectureTimes[lectureIndex]);

            if (checkItem != null) {
                tr.append($('<td class="hoverclass" id="' + (checkItem.courseCode) + '">').text(checkItem.courseCode + "/").append($('<p style="margin: 0px">').text(checkItem.courseName)));
            } else {
                tr.append($('<td class="hoverclass" id="XX00Y0000">').text("--"));
            }
        });
    });
}


function downloadCourseInfo(course) {
    var items = [];
    $.getJSON(course, function (data) {
        $.each(data, function (key, val) {
            items.push(val);
        });
        console.log("items=" + items);
        createCourseObjectFromJsonObject(items)
        drawTable();
    });
}

function lookupForTableItem(position) {
    for (var i = 0, len = selectedCoursesArray.length; i < len; i++) {
        if (selectedCoursesArray[i].position.toLowerCase() === position.toLowerCase())
            return selectedCoursesArray[i];
    }
    return null;
}


function login() {

}