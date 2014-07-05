package org.ltky.validator;

import org.apache.commons.lang3.StringUtils;
import org.ltky.model.Course;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 6.1.2014
 */
public class CourseValidator {

    private CourseValidator() {};

    public static boolean validateCourse(Course course) {
        if (StringUtils.isBlank(course.getCourseCode()) | !investigateLength(course.getCourseCode(), 32)) {
            return false;
        }
        if (StringUtils.isBlank(course.getCourseName()) | !investigateLength(course.getCourseName(), 256)) {
            return false;
        }
        if (course.getWeekNumber() == null | !investigateLength(course.getWeekNumber(), 128)) {
            return false;
        }
        if (!investigateLength(course.getWeekDay(), 4)) {
            return false;
        }
        if (course.getTimeOfDay() == null | !investigateLength(course.getTimeOfDay(), 32)) {
            return false;
        }
        if (!investigateLength(course.getClassroom(), 64)) {
            return false;
        }
        if (!investigateLength(course.getType(), 4)) {
            return false;
        }
        if (!investigateLength(course.getDepartment(), 4)) {
            return false;
        }
        if (!investigateLength(course.getTeacher(), 64)) {
            return false;
        }

        return true;
    }

    private static boolean investigateLength(String courseData, int max) {
        return StringUtils.length(courseData) >= 0 && StringUtils.length(courseData) <= max;
    }
}
