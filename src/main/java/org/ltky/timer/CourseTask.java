package org.ltky.timer;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.parser.HtmlParser;
import org.ltky.validator.CourseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 8.12.2013
 */
@Service
public class CourseTask implements Runnable {
    private String department;
    private String departmentData;
    private static final Logger LOGGER = Logger.getLogger(CourseTask.class);
    @Autowired(required = true)
    private CourseDao courseDao;

    @Autowired
    public CourseTask(@Value("$property.value:orDefaultIfNeeded") String department, @Value("$property.value:orDefaultIfNeeded") String departmentData) {
        this.department = department;
        this.departmentData = departmentData;
    }

    @Override
    public void run() {
        LOGGER.info(Thread.currentThread().getName() + " Start, cmd=" + department);
        saveCourseToDB();
    }

    private void saveCourseToDB() {
        try {
            courseDao.delete();     //clean old courses
            (new HtmlParser(department).parse(departmentData)).stream().filter(newCourse -> CourseValidator.validateCourse(newCourse)).forEach(courseDao::saveOrUpdate);
        } catch (Exception e) {
            LOGGER.error("HtmlParser error", e);
        }
    }
}
