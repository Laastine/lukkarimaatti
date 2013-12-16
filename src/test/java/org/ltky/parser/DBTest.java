package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.ltky.dao.CourseDao;
import org.ltky.model.Course;
import org.ltky.timer.FetchJob;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
public class DBTest {
    private static final Logger logger = Logger.getLogger(DBTest.class);

    @Test
    public void saveCoursesTest() {
        logger.debug("saveCoursesTest");
        try {
            new FetchJob().fetch();
        } catch (Exception e) {
            logger.error("Error while saving course data to DB", e);
            Assert.fail("DB failure");
        }
    }
}
