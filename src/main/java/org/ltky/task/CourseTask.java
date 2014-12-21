package org.ltky.task;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.parser.CourseHtmlParser;
import org.ltky.validator.CourseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 8.12.2013
 */
@Component
public class CourseTask {
    private static final Logger LOGGER = Logger.getLogger(CourseTask.class);
    private String department;
    private String departmentData;

    @Autowired
    private CourseDao courseDao;

    public void parse(String department, String departmentData) {
        this.department = department;
        this.departmentData = departmentData;
        LOGGER.info(Thread.currentThread().getName() + " Start, cmd=" + department);
        saveCourseToDB();
    }

    private void saveCourseToDB() {
        try {
            (new CourseHtmlParser(department)
                    .parse(departmentData))
                    .stream()
                    .filter(course -> CourseValidator.validateCourse(course))
                    .forEach(courseDao::save);
        } catch (Exception e) {
            LOGGER.error("HtmlParser error", e);
        }
    }
}
