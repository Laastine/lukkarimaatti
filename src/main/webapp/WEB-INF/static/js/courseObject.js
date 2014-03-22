
function createCourseObjectFromJsonObject(fetchedItems) {

    $.each(fetchedItems, function (index, course_to_process) {
        //selectedCoursesArray[selectedCoursesArray.length] = createCourseObject(course_to_process.courseName, course_to_process.courseCode, course_to_process.weekDay,  course_to_process.timeOfDay);
        selectedCoursesArray[selectedCoursesArray.length] = JSON.stringify(course_to_process);
        console.log(selectedCoursesArray);
    });
/*
    function createCourseObject(courseName, courseCode, weekDay, timeOfDay){
        var course = {};
        course.weekDay = weekDay;
        course.timeOfDay = timeOfDay.split('-');
        course.startTime = course.timeOfDay[0];
        course.endTime = course.timeOfDay[1];
        course.courseName = courseName;
        course.courseCode = courseCode;
        course.position = course.weekDay + course.startTime;
        return course;
    }
*/
}
