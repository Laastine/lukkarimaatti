package org.ltky;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.ltky.config.WebConfig;
import org.ltky.dao.CourseDao;
import org.ltky.dao.model.Course;
import org.ltky.task.TaskConfigurer;
import org.ltky.validator.CourseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.List;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = WebConfig.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class DBTest {
    private static final Logger LOGGER = Logger.getLogger(DBTest.class);
    @Autowired
    private TaskConfigurer taskConfigurer;

    @Autowired
    private CourseDao courseDao;

    @Before
    public void saveCoursesTest() {
        try {
            taskConfigurer.setUpRunners();
        } catch (Exception e) {
            LOGGER.error("Error while saving course data to DB", e);
            Assert.fail("DB failure");
        }
    }

    @Test
    public void fetchDataTest() {
        List<Course> list = courseDao.findByCourseCode("CT30A3201");
        list
            .stream()
            .filter(course -> CourseValidator.validateCourse(course));
        list.forEach(course -> LOGGER.info(course));
        Assert.assertFalse(list.isEmpty());
    }


}
