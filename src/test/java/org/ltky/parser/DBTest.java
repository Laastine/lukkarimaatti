package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.ltky.dao.CourseDao;
import org.ltky.model.Course;
import org.ltky.timer.FetchJob;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.UnsupportedEncodingException;
import java.util.List;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"/hibernate/hibernateConfig.xml"})
public class DBTest {
    private static final Logger LOGGER = Logger.getLogger(DBTest.class);

    @Test
    public void saveCoursesTest() { //Use to updated DB
        try {
            new FetchJob().fetch();
        } catch (Exception e) {
            LOGGER.error("Error while saving course data to DB", e);
            Assert.fail("DB failure");
        }
    }

    @Test
    public void encodingTest() throws UnsupportedEncodingException {
        final ApplicationContext applicationContext = new ClassPathXmlApplicationContext("hibernate/hibernateConfig.xml");
        final CourseDao courseDao = (CourseDao) applicationContext.getBean("courseDao");
        final List<Course> list1 = courseDao.findByCourseCode("CT60A0210");
        String a = new String(("Käytännön ohjelmointi=" + list1.get(1).getCourseName()).getBytes("UTF-8"), "ISO8859-1");
        LOGGER.debug(a);
    }

}
