package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.ltky.task.ExamTask;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.IOException;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 20.4.2014
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"/hibernate/hibernateConfig.xml"})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class ExamTest {
    private static final Logger LOGGER = Logger.getLogger(ExamTest.class);

    @Test
    public void testDepartmentData() {
        final ExamParser examParser = new ExamParser();
        try {
            examParser.parseExams();
        } catch (IOException e) {
            LOGGER.error("Exam parse error", e);
        }
    }

    @Test
    public void saveExamsTest() {
        try {
            new ExamTask().saveExamsToDB();
        } catch (Exception e) {
            LOGGER.error("Error while saving course data to DB", e);
            Assert.fail("DB failure");
        }
    }
}
