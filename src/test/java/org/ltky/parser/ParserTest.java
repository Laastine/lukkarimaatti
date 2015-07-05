package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.ltky.util.Util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
public class ParserTest {
    private static final Logger LOGGER = Logger.getLogger(ParserTest.class);
    private Util UTIL;
    private ParserConfiguration config;
    private URLParser parser;

    @Before
    public void init() {
        UTIL = Util.getInstance();
        config = ParserConfiguration.getInstance();
        parser = new URLParser();
    }

    @Test
    public void parserTest() {
        try {
            Map<String, String> map = parser.parseLinks();
            assertTrue(map.size() == 11);
            for (String s : map.keySet()) {
                LOGGER.debug("Department=" + s);
            }
        } catch (Exception e) {
            LOGGER.error("Error while fetching stuff from " + config.getUniURL(), e);
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
        assertEquals(res1, UTIL.processWeekNumbers(t1));
        assertEquals(res2, UTIL.processWeekNumbers(t2));
        assertEquals(res3, UTIL.processWeekNumbers(t3));
        assertEquals(res4, UTIL.processWeekNumbers(t4));
        assertEquals(res5, UTIL.processWeekNumbers(t5));
        assertEquals(res6, UTIL.processWeekNumbers(t6));
        assertEquals(res7, UTIL.processWeekNumbers(t7));
        assertNotEquals(res7, UTIL.processWeekNumbers(t1));
        assertNotEquals(res5, UTIL.processWeekNumbers(t1));
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
        assertEquals(res.size(), UTIL.removeDuplicates(list).size());
        assertTrue(res.contains("a"));
        assertTrue(res.contains("b"));
        assertTrue(res.contains("c"));
        assertTrue(res.contains("g"));
        assertTrue(res.contains("d"));
        assertTrue(res.contains("e"));
        assertTrue(res.contains("i"));
        assertFalse(res.contains("k"));
        assertFalse(res.contains("p"));
    }
}