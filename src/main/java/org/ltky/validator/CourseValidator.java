package org.ltky.validator;

import org.apache.log4j.Logger;
import org.ltky.entity.Course;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 6.1.2014
 */
public class CourseValidator {
    private static final Logger LOGGER = Logger.getLogger(CourseValidator.class);

    private static final int MIN = 0;

    public static boolean validateCourse(Course course) {
        if (course.getCourseCode() == null | course.getCourseCode().isEmpty() | !investigateLength(course.getCourseCode(),32)) {
            return false;
        }
        if (course.getCourseName() == null | course.getCourseName().isEmpty() | !investigateLength(course.getCourseName(), 256)) {
            return false;
        }
        if (!investigateLength(course.getPeriod(), 64)) {
            return false;
        }
        if (course.getWeekNumber() == null | !investigateLength(course.getWeekNumber(), 16)) {
            return false;
        }
        if (!investigateLength(course.getWeekDay(), 4)) {
            return false;
        }
        if (course.getTimeOfDay() == null | !investigateLength(course.getTimeOfDay(), 32)) {
            return false;
        }
        if (!investigateLength(course.getClassroom(),64)) {
            return false;
        }
        if (!investigateLength(course.getType(), 4)) {
            return false;
        }
        if (!investigateLength(course.getDepartment(),4)) {
            return false;
        }
        if (!investigateLength(course.getTeacher(), 64)) {
            return false;
        }
        if(LOGGER.isDebugEnabled())
            LOGGER.debug(course.getCourseCode() + " " + course.getCourseName() + " is a valid course");
        return true;
    }

    private static boolean investigateLength(String courseData, int max) {
        return courseData.length() >= CourseValidator.MIN && courseData.length() <= max;
    }
}
