package org.ltky.task;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.parser.HtmlParser;
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
    @Autowired(required = true)
    private CourseDao courseDao;

    public void parse(String department, String departmentData) {
        LOGGER.info("PARSE");
        this.department = department;
        this.departmentData = departmentData;
        LOGGER.info(Thread.currentThread().getName() + " Start, cmd=" + department);
        saveCourseToDB();
    }

    private void saveCourseToDB() {
        try {
            (new HtmlParser(department).parse(departmentData)).stream().filter(newCourse -> CourseValidator.validateCourse(newCourse)).forEach(courseDao::saveOrUpdate);
        } catch (Exception e) {
            LOGGER.error("HtmlParser error", e);
        }
    }
}