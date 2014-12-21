package org.ltky.util;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 16.1.2014
 */
public class RegexTest {
    private final Util UTIL = Util.getInstance();
    private final CoursePattern coursePattern = new CoursePattern();
    private static final Logger LOGGER = Logger.getLogger(RegexTest.class);
    private final List<String> list = new ArrayList<>();

    @Before
    public void init() {
    list.add("35-41");
    list.add("36, 2");
    list.add("1");
    list.add("3, 6, 11-12, 15");
    list.add("2-7, 11-12, 15");
    }

    @Test
    public void simpleTest() {
        init();
        for (String s : list) {
            LOGGER.debug("\n"+s+" = \n"+ UTIL.extractPattern(s, coursePattern.getWeekNumber())+"\n");
        }
        Assert.assertTrue(true);
    }
}
