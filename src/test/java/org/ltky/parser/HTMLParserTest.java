package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.ltky.entity.Course;

import java.io.IOException;
import java.util.List;
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
    private static final String COURSE_TEST_DATA =
            "<table class='spreadsheet' cellspacing='0' cellpadding='2%' border='t'>\n" +
                    "<col class='column0' /><col class='column1' /><col class='column2' /><col class='column3' /><col class='column4' /><col class='column5' /><col class='column6' /><col class='column7' />\n" +
                    "<tr class='columnTitles'>\n" +
                    "<td></td>\n" +
                    "<td>Periodi</td>\n" +
                    "<td>Vko</td>\n" +
                    "<td>      </td>\n" +
                    "<td>Klo</td>\n" +
                    "<td>      </td>\n" +
                    "<td>Sali</td>\n" +
                    "<td></td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>CT50A6000 - Pattern Recognition/L</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>2-8, 10-15, 17</td>\n" +
                    "<td>ke</td>\n" +
                    "<td>14</td>\n" +
                    "<td>17</td>\n" +
                    "<td>7443*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>CT50A6000 - Pattern Recognition/H</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>2-8, 10-15, 17</td>\n" +
                    "<td>to</td>\n" +
                    "<td>12</td>\n" +
                    "<td>14</td>\n" +
                    "<td>ML 6216*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "</table>";
    private static final String COURSE_TEST_DATA2 =
            "<table class='spreadsheet' cellspacing='0' cellpadding='2%' border='t'>\n" +
                    "<col class='column0' /><col class='column1' /><col class='column2' /><col class='column3' /><col class='column4' /><col class='column5' /><col class='column6' /><col class='column7' />\n" +
                    "<tr class='columnTitles'>\n" +
                    "<td></td>\n" +
                    "<td>Periodi</td>\n" +
                    "<td>Vko</td>\n" +
                    "<td>      </td>\n" +
                    "<td>Klo</td>\n" +
                    "<td>      </td>\n" +
                    "<td>Sali</td>\n" +
                    "<td></td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>CT30A9700 - Network Security/L</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>2-6, 8</td>\n" +
                    "<td>ke</td>\n" +
                    "<td>10</td>\n" +
                    "<td>12</td>\n" +
                    "<td>Yo-talo LS 213*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>CT30A9700 - Network Security/L</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>7</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>10</td>\n" +
                    "<td>12</td>\n" +
                    "<td>6323*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>CT30A9700 - Network Security/H</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>7</td>\n" +
                    "<td>ke</td>\n" +
                    "<td>10</td>\n" +
                    "<td>12</td>\n" +
                    "<td>ML 6218, LINUX*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>CT30A9700 - Network Security/H</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>2-6, 8</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>10</td>\n" +
                    "<td>12</td>\n" +
                    "<td>ML 6218, LINUX*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "</table>";

    @Before
    public void init() {
        try {
            map = new URLParser().fetchStuff();
        } catch (IOException e) {
            LOGGER.error(e);
        }
    }

    @Test
    public void HTMLDataParsingTest() throws IOException {
        HtmlParser htmlParser = new HtmlParser(TITE);
        List<Course> list = htmlParser.parseHTMLData(COURSE_TEST_DATA);
        List<Course> list2 = htmlParser.parseHTMLData(COURSE_TEST_DATA2);
        Assert.assertFalse(list.isEmpty());
        Assert.assertFalse(list2.isEmpty());
    }

    @Test
    public void testDepartmentData() {
        testCourseData(TITE);
    }

    private void testCourseData(String department) {
        try {
            Assert.assertNotNull(map);
            final HtmlParser htmlParser = new HtmlParser(department);
            htmlParser.parse(map.get(department));
        } catch (Exception e) {
            LOGGER.error("test error", e);
        }
    }
}
