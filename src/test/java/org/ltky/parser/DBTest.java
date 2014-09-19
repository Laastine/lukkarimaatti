package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.ltky.task.CourseTask;
import org.ltky.task.TaskConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/dispatcher-servlet.xml"})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class DBTest {
    private static final Logger LOGGER = Logger.getLogger(DBTest.class);
    @Autowired
    private TaskConfigurer taskConfigurer;

    @Test
    public void saveCoursesTest() {
        try {
            taskConfigurer.setUpRunners();
        } catch (Exception e) {
            LOGGER.error("Error while saving course data to DB", e);
            Assert.fail("DB failure");
        }
    }
}
