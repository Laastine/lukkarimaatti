package org.ltky;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.ltky.dao.model.Course;
import org.ltky.parser.CourseHtmlParser;
import org.ltky.parser.URLParser;

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
    private static final String LANGUAGE_LAB_TEST_DATA =
            "<table class='spreadsheet' cellspacing='0' cellpadding='2%' border='t'>\n" +
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
                    "<td>FV14A1200 - Venäjä 1: D</td>\n" +
                    "<td>Kullberg, Olesya</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>35-41, 43-49</td>\n" +
                    "<td>to</td>\n" +
                    "<td>12</td>\n" +
                    "<td>14</td>\n" +
                    "<td>1427C*</td>\n" +
                    "<td>Mainitse ilmoittautuessasi Lisätietoja-kenttään, oletko lukenut kieltä aiemmin jossain muualla ja kuinka monta vuotta.</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>FV14A1200 - Venäjä 1: D</td>\n" +
                    "<td>Kullberg, Olesya</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>35-41, 43-49</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>8</td>\n" +
                    "<td>10</td>\n" +
                    "<td>1407</td>\n" +
                    "<td>Mainitse ilmoittautuessasi Lisätietoja-kenttään, oletko lukenut kieltä aiemmin jossain muualla ja kuinka monta vuotta.</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>FV14A1200 - Venäjä 1: C</td>\n" +
                    "<td>Bagrova, Natalia</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>2-8, 10-15, 17</td>\n" +
                    "<td>to</td>\n" +
                    "<td>10</td>\n" +
                    "<td>12</td>\n" +
                    "<td>1407</td>\n" +
                    "<td>Mainitse ilmoittautuessasi Lisätietoja-kenttään, oletko lukenut kieltä aiemmin jossain muualla ja kuinka monta vuotta.</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>FV14A1200 - Venäjä 1: C</td>\n" +
                    "<td>Bagrova, Natalia</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>2-8, 10-15, 17</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>12</td>\n" +
                    "<td>14</td>\n" +
                    "<td>1431*</td>\n" +
                    "<td>Mainitse ilmoittautuessasi Lisätietoja-kenttään, oletko lukenut kieltä aiemmin jossain muualla ja kuinka monta vuotta.</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>FV14A1200 - Venäjä 1: A</td>\n" +
                    "<td>Bagrova, Natalia</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>43</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>8</td>\n" +
                    "<td>10</td>\n" +
                    "<td>1431*</td>\n" +
                    "<td>Mainitse ilmoittautuessasi Lisätietoja-kenttään, oletko lukenut kieltä aiemmin jossain muualla ja kuinka monta vuotta.</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>FV14A1200 - Venäjä 1: B</td>\n" +
                    "<td>Kullberg, Olesya</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>35-41, 43-49</td>\n" +
                    "<td>ke</td>\n" +
                    "<td>12</td>\n" +
                    "<td>14</td>\n" +
                    "<td>1427A</td>\n" +
                    "<td>Mainitse ilmoittautuessasi Lisätietoja-kenttään, oletko lukenut kieltä aiemmin jossain muualla ja kuinka monta vuotta.</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>FV14A1200 - Venäjä 1: B</td>\n" +
                    "<td>Kullberg, Olesya</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>35-41, 43-49</td>\n" +
                    "<td>ma</td>\n" +
                    "<td>12</td>\n" +
                    "<td>14</td>\n" +
                    "<td>1427A</td>\n" +
                    "<td>Mainitse ilmoittautuessasi Lisätietoja-kenttään, oletko lukenut kieltä aiemmin jossain muualla ja kuinka monta vuotta.</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>FV14A1200 - Venäjä 1: A</td>\n" +
                    "<td>Bagrova, Natalia</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>35-41, 43-49</td>\n" +
                    "<td>to</td>\n" +
                    "<td>12</td>\n" +
                    "<td>14</td>\n" +
                    "<td>1410A</td>\n" +
                    "<td>Mainitse ilmoittautuessasi Lisätietoja-kenttään, oletko lukenut kieltä aiemmin jossain muualla ja kuinka monta vuotta.</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>FV14A1200 - Venäjä 1: A</td>\n" +
                    "<td>Bagrova, Natalia</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>35-41, 44-49</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>8</td>\n" +
                    "<td>10</td>\n" +
                    "<td>1410A</td>\n" +
                    "<td>Mainitse ilmoittautuessasi Lisätietoja-kenttään, oletko lukenut kieltä aiemmin jossain muualla ja kuinka monta vuotta.</td>\n" +
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
                    "<td>BH60A0250 - Kiinteiden päästöjen hallinta /S</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "<td>46-47</td>\n" +
                    "<td>to</td>\n" +
                    "<td>14</td>\n" +
                    "<td>16</td>\n" +
                    "<td>7339*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>BH60A0250 - Kiinteiden päästöjen hallinta /H</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>35-41, 43-49</td>\n" +
                    "<td>ke</td>\n" +
                    "<td>10</td>\n" +
                    "<td>12</td>\n" +
                    "<td>4301+4302*</td>\n" +
                    "<td>&nbsp;</td>\n" +
                    "</tr>\n" +
                    "<tr>\n" +
                    "<td>BH60A0250 - Kiinteiden päästöjen hallinta /L</td>\n" +
                    "<td>Periodi 1-2</td>\n" +
                    "<td>35-41, 43-49</td>\n" +
                    "<td>ti</td>\n" +
                    "<td>12</td>\n" +
                    "<td>14</td>\n" +
                    "<td>1381</td>\n" +
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
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(TITE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(COURSE_TEST_DATA);
        List<Course> list2 = courseHtmlParser.parseHTMLData(COURSE_TEST_DATA2);
        Assert.assertFalse(list.isEmpty());
        Assert.assertFalse(list2.isEmpty());
    }

    @Test
    public void HTMLanguageLabLDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(KIKE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(LANGUAGE_LAB_TEST_DATA);
        Assert.assertFalse(list.isEmpty());
        LOGGER.info("LL=" + list.get(0).toString());
    }

    @Test
    public void PuppaDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(TUTA_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(PUPPA_TEST_DATA);
        Assert.assertFalse(list.isEmpty());
        LOGGER.info("TUTA=" + list.get(0).toString());
    }

    @Test
    public void KatiDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(KATI_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(KATI_TEST_DATA);
        Assert.assertFalse(list.isEmpty());
        LOGGER.info("KATI=" + list.get(0).toString());
    }

    @Test
    public void YmteDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(YMTE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(YMTE_TEST_DATA);
        Assert.assertFalse(list.isEmpty());
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
