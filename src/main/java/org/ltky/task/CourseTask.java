package org.ltky.task;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.dao.model.Course;
import org.ltky.parser.CourseHtmlParser;
import org.ltky.validator.CourseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

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
        saveCourseToDB();
    }

    private void saveCourseToDB() {
        try {
            List<Course> coursesToBeSaved = (new CourseHtmlParser(department)
                    .parse(departmentData))
                    .stream()
                    .filter(CourseValidator::validateCourse).collect(Collectors.toList());
            LOGGER.info("Saving " + department + " " + coursesToBeSaved.size() + "pcs");
            courseDao.save(coursesToBeSaved);
        } catch (Exception e) {
            LOGGER.error("HtmlParser error", e);
        }
    }
}
