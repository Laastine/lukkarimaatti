function createCourseObjectFromJsonObject(fetchedItems) {
    $.each(fetchedItems, function (index, course_to_process) {
        selectedCoursesArray[selectedCoursesArray.length] = JSON.stringify(course_to_process);
        console.log(selectedCoursesArray);
    });
}
