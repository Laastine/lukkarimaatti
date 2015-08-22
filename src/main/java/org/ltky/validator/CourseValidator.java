package org.ltky.validator;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.ltky.dao.model.Course;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 6.1.2014
 */
public class CourseValidator {
    private static final Logger LOGGER = Logger.getLogger(CourseValidator.class);

    public static boolean validateCourse(Course course) {
        if (StringUtils.isBlank(course.courseCode) || investigateLength(course.courseCode, 32)) {
            LOGGER.debug("courseCode fails=" + course.courseCode);
            return false;
        }
        if (StringUtils.isBlank(course.courseName) || investigateLength(course.courseName, 256)) {
            LOGGER.debug("courseName fails=" + course.courseName);
            return false;
        }
        if (course.weekNumber == null || investigateLength(course.weekNumber, 128)) {
            LOGGER.debug("weekNumber fails" + course.weekNumber);
            return false;
        }
        if (investigateLength(course.weekDay, 4)) {
            LOGGER.debug("weekDay fails=" + course.weekDay);
            return false;
        }
        if (course.timeOfDay == null || investigateLength(course.timeOfDay, 32)) {
            LOGGER.debug("timeOfDay fails=" + course.timeOfDay);
            return false;
        }
        if (investigateLength(course.classroom, 64)) {
            LOGGER.debug("classroom fails=" + course.classroom);
            return false;
        }
        if (investigateLength(course.type, 32)) {
            LOGGER.debug("type fails=" + course.type);
            return false;
        }
        if (investigateLength(course.department, 4)) {
            LOGGER.debug("department fails=" + course.department);
            return false;
        }
        if (investigateLength(course.teacher, 64)) {
            LOGGER.debug("teacher fails=" + course.teacher);
            return false;
        }
        LOGGER.debug("Saving=" + course);
        return true;
    }

    private static boolean investigateLength(String courseData, int max) {
        return StringUtils.length(courseData) < 0 || StringUtils.length(courseData) > max;
    }
}
