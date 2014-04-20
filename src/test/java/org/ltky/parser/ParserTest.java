package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
public class ParserTest {
    private static final Logger LOGGER = Logger.getLogger(ParserTest.class);

    @Test
    public void parserTest() {
        ParserConfiguration config = ParserConfiguration.getInstance();
        URLParser parser = new URLParser();
        try {
            Map<String, String> map = parser.fetchStuff();
            //Assert.assertNotNull(map);
            for (String s : map.keySet()) {
                LOGGER.debug("Department=" + s);
            }
        } catch (Exception e) {
            LOGGER.error("Error while fetching stuff from " + config.getUniURL(), e);
        }
    }

    @Test
    public void examParserTest() {
        ParserConfiguration config = ParserConfiguration.getInstance();
        URLParser parser = new URLParser();
        final String regex = "^https://uni.lut.fi/*";
        try {
            String s = parser.fetchExamURL();
            LOGGER.info("fetchExamURL=" + s);
            Assert.assertTrue(isMatch(parser.fetchExamURL(), regex));
        } catch (Exception e) {
            LOGGER.error("Error while fetching stuff from " + config.getUniURL(), e);
        }
    }

    private static boolean isMatch(String s, String pattern) {
        try {
            Pattern p = Pattern.compile(pattern);
            Matcher m = p.matcher(s);
            return m.matches();
        } catch (Exception e) {
            return false;
        }
    }
}