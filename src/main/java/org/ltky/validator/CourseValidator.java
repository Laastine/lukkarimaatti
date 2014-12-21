package org.ltky.validator;

import org.apache.commons.lang3.StringUtils;
import org.ltky.dao.model.Course;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 6.1.2014
 */
public class CourseValidator {

    public static boolean validateCourse(Course course) {
        if (StringUtils.isBlank(course.courseCode) || !investigateLength(course.courseCode, 32)) {
            return false;
        }
        if (StringUtils.isBlank(course.courseName) || !investigateLength(course.courseName, 256)) {
            return false;
        }
        if (course.weekNumber == null || !investigateLength(course.weekNumber, 128)) {
            return false;
        }
        if (!investigateLength(course.weekDay, 4)) {
            return false;
        }
        if (course.timeOfDay == null || !investigateLength(course.timeOfDay, 32)) {
            return false;
        }
        if (!investigateLength(course.classroom, 64)) {
            return false;
        }
        if (!investigateLength(course.type, 4)) {
            return false;
        }
        if (!investigateLength(course.department, 4)) {
            return false;
        }
        if (!investigateLength(course.teacher, 64)) {
            return false;
        }
        return true;
    }

    private static boolean investigateLength(String courseData, int max) {
        return StringUtils.length(courseData) >= 0 && StringUtils.length(courseData) <= max;
    }
}
