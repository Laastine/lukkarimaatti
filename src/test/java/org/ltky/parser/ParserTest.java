package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.ltky.util.Util;

import java.util.ArrayList;
import java.util.List;
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
    private Util util;
    private ParserConfiguration config;
    private URLParser parser;

    @Before
    public void init() {
        util = new Util();
        config = ParserConfiguration.getInstance();
        parser = new URLParser();
    }

    @Test
    public void parserTest() {
        try {
            Map<String, String> map = parser.fetchStuff();
            Assert.assertTrue(map.size() == 10);
            for (String s : map.keySet()) {
                LOGGER.debug("Department=" + s);
            }
        } catch (Exception e) {
            LOGGER.error("Error while fetching stuff from " + config.getUniURL(), e);
        }
    }

    @Test
    public void examParserTest() {
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
            Matcher m = Pattern.compile(pattern).matcher(s);
            return m.lookingAt();
        } catch (Exception e) {
            return false;
        }
    }

    @Test
    public void weekNumberProcessTest() {
        final String t1 = "2-4, 6-8, 10, 12-15, 17", res1 = "2,3,4,6,7,8,10,12,13,14,15,17";
        final String t2 = "35-36, 40, 43-48", res2 = "35,36,40,43,44,45,46,47,48";
        final String t3 = "37", res3 = "37";
        final String t4 = "7", res4 = "7";
        final String t5 = "40-41, 43-49", res5 = "40,41,43,44,45,46,47,48,49";
        final String t6 = "35-37", res6 = "35,36,37";
        final String t7 = "42, 50, 9, 19", res7 = "9,19,42,50";
        Assert.assertTrue(res1.equals(util.processWeekNumbers(t1)));
        Assert.assertTrue(res2.equals(util.processWeekNumbers(t2)));
        Assert.assertTrue(res3.equals(util.processWeekNumbers(t3)));
        Assert.assertTrue(res4.equals(util.processWeekNumbers(t4)));
        Assert.assertTrue(res5.equals(util.processWeekNumbers(t5)));
        Assert.assertTrue(res6.equals(util.processWeekNumbers(t6)));
        Assert.assertTrue(res7.equals(util.processWeekNumbers(t7)));
        Assert.assertFalse(res7.equals(util.processWeekNumbers(t1)));
        Assert.assertFalse(res5.equals(util.processWeekNumbers(t1)));
    }

    @Test
    public void removeDuplicatesTest() {
        List<String> list = new ArrayList<>();
        list.add("a");
        list.add("b");
        list.add("c");
        list.add("g");
        list.add("d");
        list.add("e");
        list.add("i");
        list.add("c");
        list.add("i");
        list.add("a");
        list.add("b");
        list.add("g");
        List<String> res = new ArrayList<>();
        res.add("a");
        res.add("b");
        res.add("c");
        res.add("g");
        res.add("d");
        res.add("e");
        res.add("i");
        Assert.assertTrue(res.size() == util.removeDuplicates(list).size());
        Assert.assertTrue(res.contains("a"));
        Assert.assertTrue(res.contains("b"));
        Assert.assertTrue(res.contains("c"));
        Assert.assertTrue(res.contains("g"));
        Assert.assertTrue(res.contains("d"));
        Assert.assertTrue(res.contains("e"));
        Assert.assertTrue(res.contains("i"));
        Assert.assertFalse(res.contains("k"));
        Assert.assertFalse(res.contains("p"));
    }
}