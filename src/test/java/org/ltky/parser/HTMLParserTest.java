package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.ltky.dao.model.Course;

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
    private static final String TITE_DEPARTMENT = "tite";
    private static final String KIKE_DEPARTMENT = "kike";
    private static final String TUTA_DEPARTMENT = "tuta";
    private static final String KATI_DEPARTMENT = "kati";
    private static final String YMTE_DEPARTMENT = "ymte";
    private static final String ENTE_DEPARTMENT = "ente";
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
    private static final String LANGUAGE_LAB_FRENCH = "<table class='spreadsheet' cellspacing='0' cellpadding='2%' border='t'>\n" +
            "<col class='column0' /><col class='column1' /><col class='column2' /><col class='column3' /><col class='column4' /><col class='column5' /><col class='column6' /><col class='column7' /><col class='column8' />\n" +
            "<tr class='columnTitles'>\n" +
            "<td></td>\n" +
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
            "<td>FV15A1420 - Ranskan jatkokurssi 2: A</td>\n" +
            "<td>Paakkonen, Vuokko</td>\n" +
            "<td>Periodi 4</td>\n" +
            "<td>11-16</td>\n" +
            "<td>to</td>\n" +
            "<td>12</td>\n" +
            "<td>14</td>\n" +
            "<td>1427A</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV15A1420 - Ranskan jatkokurssi 2: A</td>\n" +
            "<td>Paakkonen, Vuokko</td>\n" +
            "<td>Periodi 4</td>\n" +
            "<td>11-16</td>\n" +
            "<td>ti</td>\n" +
            "<td>12</td>\n" +
            "<td>14</td>\n" +
            "<td>1427A</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "</table>";
    private static final String LANGUAGE_LAB_FINNISH = "<table class='spreadsheet' cellspacing='0' cellpadding='2%' border='t'>\n" +
            "<col class='column0' /><col class='column1' /><col class='column2' /><col class='column3' /><col class='column4' /><col class='column5' /><col class='column6' /><col class='column7' /><col class='column8' />\n" +
            "<tr class='columnTitles'>\n" +
            "<td></td>\n" +
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
            "<td>FV18A9301 - Finnish 3: A</td>\n" +
            "<td>Häkkinen, Elina</td>\n" +
            "<td>Periodi 3-4</td>\n" +
            "<td>3-8, 11-16</td>\n" +
            "<td>to</td>\n" +
            "<td>10</td>\n" +
            "<td>12</td>\n" +
            "<td>1407</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "</table>";
    private static final String PUPPA_TEST_DATA =
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
                    "<td>CS31A0101- Kustannusjohtamisen peruskurssi/L</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>41</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>15</td>\n" +
                    "<td>17</td>\n" +
                    "<td>Viipuri-sali*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>CS31A0101- Kustannusjohtamisen peruskurssi/H</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>37-41</td>\n" +
                    "<td>to</td>\n" +
                    "<td>8</td>\n" +
                    "<td>10</td>\n" +
                    "<td>1381</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>CS31A0101- Kustannusjohtamisen peruskurssi/L</td>\n" +
                    "<td>Periodi 1</td>\n" +
                    "<td>35-41</td>\n" +
                    "<td>ma</td>\n" +
                    "<td>10</td>\n" +
                    "<td>12</td>\n" +
                    "<td>1381</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>CS31A0101- Kustannusjohtamisen peruskurssi/L</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>35-40</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>15</td>\n" +
                    "<td>17</td>\n" +
                    "<td>2310*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "</table>";
    private static final String KATI_TEST_DATA =
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
                    "<td>A250A0350 - Makroteoria/L</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>9</td>\n" +
                    "<td>pe</td>\n" +
                    "<td>9:00</td>\n" +
                    "<td>15:00</td>\n" +
                    "<td>1382</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>A250A0350 - Makroteoria/L</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>9</td>\n" +
                    "<td>ke</td>\n" +
                    "<td>9:00</td>\n" +
                    "<td>15:00</td>\n" +
                    "<td>1382</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>A250A0350 - Makroteoria/L</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>9</td>\n" +
                    "<td>to</td>\n" +
                    "<td>9:00</td>\n" +
                    "<td>15:00</td>\n" +
                    "<td>1382</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>A250A0350 - Makroteoria/L</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>9</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>9:00</td>\n" +
                    "<td>15:00</td>\n" +
                    "<td>1382</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "</table>";
    private static final String YMTE_TEST_DATA =
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
                    "<td>BH60A1200 - Ilmanvaihto- ja ilmastointitekniikka/HR/02</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>37-42, 44-49</td>\n" +
                    "<td>ke</td>\n" +
                    "<td>10</td>\n" +
                    "<td>12</td>\n" +
                    "<td>ML 7439 (sini)*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>BH60A1200 - Ilmanvaihto- ja ilmastointitekniikka/H</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>3-4</td>\n" +
                    "<td>ke</td>\n" +
                    "<td>14</td>\n" +
                    "<td>17</td>\n" +
                    "<td>ML 7439 (sini)*</td>\n" +
                    "<td>itsenäistä harjoitustyön tekoa</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>BH60A1200 - Ilmanvaihto- ja ilmastointitekniikka/H</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>37-42, 44-49</td>\n" +
                    "<td>ma</td>\n" +
                    "<td>15</td>\n" +
                    "<td>17</td>\n" +
                    "<td>ML 6428*</td>\n" +
                    "<td>itsenäistä harjoitustyön tekoa</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>BH60A1200 - Ilmanvaihto- ja ilmastointitekniikka/L+H</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>37-42, 44</td>\n" +
                    "<td>ma</td>\n" +
                    "<td>12</td>\n" +
                    "<td>15</td>\n" +
                    "<td>4509</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>BH60A1200 - Ilmanvaihto- ja ilmastointitekniikka/HR/01</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>37-42, 44-49</td>\n" +
                    "<td>ke</td>\n" +
                    "<td>12</td>\n" +
                    "<td>14</td>\n" +
                    "<td>ML 7439 (sini)*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "</table>\n" +
                    "<table class='footer-border-args'  border='0' cellspacing='0' width='100%'><tr>\n" +
                    "<td>\n" +
                    "<table cellspacing='0' border='0' width='100%' class='footer-0-args'>\n" +
                    "<col align='left' /><col align='center' /><col align='right' />\n" +
                    "  <tr>\n" +
                    "    <td><span class='footer-0-0-0'></span></td><td></td><td></td>\n" +
                    "  </tr>\n" +
                    "</table>\n" +
                    "</td>\n" +
                    "</tr><tr>\n" +
                    "<td>\n" +
                    "<table cellspacing='0' border='0' width='100%' class='footer-1-args'>\n" +
                    "<col align='left' /><col align='center' /><col align='right' />\n" +
                    "  <tr>\n" +
                    "    <td><span class='footer-1-0-0'>____________________________________  </span><span class='footer-1-0-1'>  </span></td><td></td><td></td>\n" +
                    "  </tr>\n" +
                    "</table>\n" +
                    "</td>\n" +
                    "</tr>\n" +
                    "</table>\n";

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
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(TITE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(COURSE_TEST_DATA);
        List<Course> list2 = courseHtmlParser.parseHTMLData(COURSE_TEST_DATA2);
        Assert.assertEquals("CT50A6000", list.get(0).courseCode);
        Assert.assertEquals("Pattern Recognition", list.get(0).courseName);
        Assert.assertEquals("CT30A9700", list2.get(0).courseCode);
        Assert.assertEquals("Network Security", list2.get(0).courseName);
    }

    @Test
    public void HTMLanguageFinnishParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(KIKE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(LANGUAGE_LAB_FINNISH);
        Assert.assertEquals("Finnish 3: A", list.get(0).courseName);
        Assert.assertEquals("FV18A9301", list.get(0).courseCode);
        Assert.assertEquals("1407", list.get(0).classroom);
        Assert.assertEquals("10-12", list.get(0).timeOfDay);
        Assert.assertEquals("to", list.get(0).weekDay);
        Assert.assertEquals("3,4,5,6,7,8,11,12,13,14,15,16", list.get(0).weekNumber);
        Assert.assertEquals("kike", list.get(0).department);
        LOGGER.info("LL=" + list.get(0).toString());
    }

    @Test
    public void HTMLanguageFrenchParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(KIKE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(LANGUAGE_LAB_FRENCH);
        Assert.assertEquals("Ranskan jatkokurssi 2: A", list.get(0).courseName);
        Assert.assertEquals("FV15A1420", list.get(0).courseCode);
        Assert.assertEquals("Paakkonen, Vuokko", list.get(0).teacher);
        Assert.assertEquals("1427A", list.get(0).classroom);
        Assert.assertEquals("12-14", list.get(0).timeOfDay);
        Assert.assertEquals("to", list.get(0).weekDay);
        Assert.assertEquals("11,12,13,14,15,16", list.get(0).weekNumber);
        Assert.assertEquals("kike", list.get(0).department);
        LOGGER.info("LL=" + list.get(0).toString());
    }

    @Test
    public void TutaDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(TUTA_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(PUPPA_TEST_DATA);
        Assert.assertEquals("Kustannusjohtamisen peruskurssi", list.get(0).courseName);
        Assert.assertEquals("CS31A0101", list.get(0).courseCode);
        Assert.assertEquals("Viipuri-sali*", list.get(0).classroom);
        Assert.assertEquals("15-17", list.get(0).timeOfDay);
        Assert.assertEquals("ti", list.get(0).weekDay);
        Assert.assertEquals("41", list.get(0).weekNumber);
        Assert.assertEquals("tuta", list.get(0).department);
        LOGGER.info("TUTA=" + list.get(0).toString());
    }

    @Test
    public void KatiDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(KATI_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(KATI_TEST_DATA);
        Assert.assertEquals("Makroteoria", list.get(0).courseName);
        Assert.assertEquals("A250A0350", list.get(0).courseCode);
        Assert.assertEquals("1382", list.get(0).classroom);
        Assert.assertEquals("9-15", list.get(0).timeOfDay);
        Assert.assertEquals("pe", list.get(0).weekDay);
        Assert.assertEquals("9", list.get(0).weekNumber);
        Assert.assertEquals("kati", list.get(0).department);
        LOGGER.info("KATI=" + list.get(0).toString());
    }

    @Test
    public void YmteDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(YMTE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(YMTE_TEST_DATA);
        Assert.assertEquals("Ilmanvaihto- ja ilmastointitekniikka", list.get(0).courseName);
        Assert.assertEquals("BH60A1200", list.get(0).courseCode);
        Assert.assertEquals("ML 7439 (sini)*", list.get(0).classroom);
        Assert.assertEquals("10-12", list.get(0).timeOfDay);
        Assert.assertEquals("ke", list.get(0).weekDay);
        Assert.assertEquals("37,38,39,40,41,42,44,45,46,47,48,49", list.get(0).weekNumber);
        Assert.assertEquals("ymte", list.get(0).department);
        LOGGER.info("YMTE=" + list.get(0).toString());
    }

    @Test
    public void testDepartmentData() {
        testCourseData(TITE_DEPARTMENT);
        testCourseData(KIKE_DEPARTMENT);
    }

    private void testCourseData(String department) {
        try {
            Assert.assertNotNull(map);
            final CourseHtmlParser courseHtmlParser = new CourseHtmlParser(department);
            courseHtmlParser.parse(map.get(department));
        } catch (Exception e) {
            LOGGER.error("test error", e);
        }
    }
}
