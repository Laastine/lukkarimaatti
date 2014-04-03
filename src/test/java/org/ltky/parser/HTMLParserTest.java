package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.ltky.util.StringHelper;

import java.io.IOException;
import java.util.Map;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 29.11.2013
 */
public class HTMLParserTest {
    private static final Logger LOGGER = Logger.getLogger(HTMLParserTest.class);
    @Rule
    public ExpectedException thrown = ExpectedException.none();
    private Map<String, String> map;

    private static final String TITE = "tite";

    private void HTMLParserTest() {
        try {
            map = new URLParser().fetchStuff();
        } catch (IOException e) {
            LOGGER.error(e);
        }
    }

    //@Test
    public void testDepartmentData() {
        testCourseData(TITE);
    }

    private void testCourseData(String department) {
        HTMLParserTest();
        try {
            Assert.assertNotNull(map);
            HtmlParser htmlParser = new HtmlParser(department);
            htmlParser.parse(map.get(department));
        } catch (Exception e) {
            LOGGER.error("test error", e);
        }
    }
}
