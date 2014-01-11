package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import java.io.IOException;
import java.util.Map;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 29.11.2013
 */
class HTMLParserTest {
    private static final Logger logger = Logger.getLogger(HTMLParserTest.class);
    @Rule
    public ExpectedException thrown = ExpectedException.none();
    private Map<String, String> map;

    private HTMLParserTest() {
        try {
            map = new Parser().fetchStuff();
        } catch (IOException e) {
            logger.error(e);
        }
    }

    //@Test
    public void testCourseData() {
        try {
            Assert.assertNotNull(map);
            HtmlParser htmlParser = new HtmlParser(map.get("tite"), "tite");
            htmlParser.formatEachEducationEvent(htmlParser.getResultList());
        } catch (Exception e) {
            logger.error("test error", e);
        }
    }
}
