package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.ltky.util.CoursePattern;
import org.ltky.util.StringHelper;

import java.util.ArrayList;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 16.1.2014
 */
public class RegexTest {
    private final StringHelper stringHelper = new StringHelper();
    private final CoursePattern coursePattern = new CoursePattern();
    private static final Logger logger = Logger.getLogger(RegexTest.class);
    private ArrayList<String> list = new ArrayList<>();

    private void init() {
    list.add("35-41");
    list.add("36, 2");
    list.add("1");
    list.add("3, 6, 11-12, 15");
    list.add("2-7, 11-12, 15");
    }

    //@Test
    public void simpleTest() {
        init();
        for (String s : list) {
            logger.debug("\n"+s+" = \n"+stringHelper.extractPattern(s, coursePattern.getWeekNumber())+"\n");
        }
        Assert.assertTrue(true);
    }
}
