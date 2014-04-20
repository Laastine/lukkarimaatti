package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 20.4.2014
 */
public class ExamTest {

    private static final Logger LOGGER = Logger.getLogger(ExamTest.class);
    private final ExamParser examParser = new ExamParser();

    @Test
    public void testDepartmentData() {
        try {
            examParser.parseExams();
        } catch (IOException e) {
            LOGGER.error("Exam parse error", e);
        }
    }

    @Test
    public void saveExamsTest() {
        LOGGER.debug("saveExamsTest");
        try {
            new ParserTask(null, null).saveExamsToDB();
        } catch (Exception e) {
            LOGGER.error("Error while saving course data to DB", e);
            Assert.fail("DB failure");
        }
    }

}
