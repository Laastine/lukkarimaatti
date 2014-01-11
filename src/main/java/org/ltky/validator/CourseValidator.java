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
    private static final Logger logger = Logger.getLogger(CourseValidator.class);

    private static final int MIN = 0;

    public static boolean validateCourse(Course course) {
        if (!investigateLength(course.getCourseCode(), "courseCode", 32)) {
            return false;
        }
        if (!investigateLength(course.getCourseName(), "courseName", 256)) {
            return false;
        }
        if (!investigateLength(course.getPeriod(), "period", 64)) {
            return false;
        }
        if (!investigateLength(course.getWeekNumber(), "weekNumber", 16)) {
            return false;
        }
        if (!investigateLength(course.getWeekDay(), "weekDay", 4)) {
            return false;
        }
        if (!investigateLength(course.getTimeOfDay(), "timeOfDay", 32)) {
            return false;
        }
        if (!investigateLength(course.getClassroom(), "classroom", 64)) {
            return false;
        }
        if (!investigateLength(course.getType(), "type", 4)) {
            return false;
        }
        if (!investigateLength(course.getDepartment(), "department", 4)) {
            return false;
        }
        if (!investigateLength(course.getTeacher(), "teacher", 64)) {
            return false;
        }
        logger.debug(course.getCourseCode() + " " + course.getCourseName() + " is a valid course");
        return true;
    }

    private static boolean investigateLength(String courseData, String attribute, int max) {
        logger.warn("Length error in " + attribute + ". Length is " + courseData.length());
        return courseData.length() >= CourseValidator.MIN && courseData.length() <= max;
    }
}
