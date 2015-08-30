package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.ltky.dao.model.Course;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

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
    private static final String LANGUAGE_LAB_FRENCH = "<table class='spreadsheet' cellspacing='0' cellpadding='2%' border='t'>\n" +
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
            "<td>FV15A1420 - Ranskan jatkokurssi 2: A</td>\n" +
            "<td>Periodi 4</td>\n" +
            "<td>10-15</td>\n" +
            "<td>ti</td>\n" +
            "<td>14</td>\n" +
            "<td>16</td>\n" +
            "<td>Yo-talo LS 205*</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV15A1420 - Ranskan jatkokurssi 2: A</td>\n" +
            "<td>Periodi 4</td>\n" +
            "<td>10-15</td>\n" +
            "<td>to</td>\n" +
            "<td>16</td>\n" +
            "<td>18</td>\n" +
            "<td>Yo-talo LS 204*</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "</table>\n";
    private static final String LANGUAGE_LAB_MULTI = "<table class='spreadsheet' cellspacing='0' cellpadding='2%' border='t'>\n" +
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
            "<td>FV12A1210 - Saksan peruskurssi 1: D</td>\n" +
            "<td>Periodi 3</td>\n" +
            "<td>2-7</td>\n" +
            "<td>to</td>\n" +
            "<td>12</td>\n" +
            "<td>14</td>\n" +
            "<td>7343.1*</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: C</td>\n" +
            "<td>Int.vko 50</td>\n" +
            "<td>50</td>\n" +
            "<td>ke</td>\n" +
            "<td>12</td>\n" +
            "<td>16</td>\n" +
            "<td>1487</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: B</td>\n" +
            "<td>Int.vko 43</td>\n" +
            "<td>43</td>\n" +
            "<td>ti</td>\n" +
            "<td>10</td>\n" +
            "<td>14</td>\n" +
            "<td>1487</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: A</td>\n" +
            "<td>Int.vko 43</td>\n" +
            "<td>43</td>\n" +
            "<td>ma</td>\n" +
            "<td>8</td>\n" +
            "<td>12</td>\n" +
            "<td>1487</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: F</td>\n" +
            "<td>Int.vko 21</td>\n" +
            "<td>21</td>\n" +
            "<td>pe</td>\n" +
            "<td>8</td>\n" +
            "<td>12</td>\n" +
            "<td>6518A</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: F</td>\n" +
            "<td>Int.vko 21</td>\n" +
            "<td>21</td>\n" +
            "<td>ma</td>\n" +
            "<td>8</td>\n" +
            "<td>14</td>\n" +
            "<td>6518A</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: F</td>\n" +
            "<td>Int.vko 21</td>\n" +
            "<td>21</td>\n" +
            "<td>ti</td>\n" +
            "<td>8</td>\n" +
            "<td>14</td>\n" +
            "<td>6518A</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: F</td>\n" +
            "<td>Int.vko 21</td>\n" +
            "<td>21</td>\n" +
            "<td>ke</td>\n" +
            "<td>8</td>\n" +
            "<td>14</td>\n" +
            "<td>6518A</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: F</td>\n" +
            "<td>Int.vko 21</td>\n" +
            "<td>21</td>\n" +
            "<td>to</td>\n" +
            "<td>8</td>\n" +
            "<td>14</td>\n" +
            "<td>6518A</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: E</td>\n" +
            "<td>Int.vko 9</td>\n" +
            "<td>9</td>\n" +
            "<td>ti</td>\n" +
            "<td>10</td>\n" +
            "<td>14</td>\n" +
            "<td>4502</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: E</td>\n" +
            "<td>Periodi 3</td>\n" +
            "<td>2-7</td>\n" +
            "<td>ke</td>\n" +
            "<td>10</td>\n" +
            "<td>12</td>\n" +
            "<td>7441 (tangentti)*</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: E</td>\n" +
            "<td>Periodi 3</td>\n" +
            "<td>2-7</td>\n" +
            "<td>ma</td>\n" +
            "<td>10</td>\n" +
            "<td>12</td>\n" +
            "<td>6518A</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: A</td>\n" +
            "<td>Periodi 1</td>\n" +
            "<td>37-42</td>\n" +
            "<td>ke</td>\n" +
            "<td>12</td>\n" +
            "<td>14</td>\n" +
            "<td>1487</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: D</td>\n" +
            "<td>Int.vko 9</td>\n" +
            "<td>9</td>\n" +
            "<td>ma</td>\n" +
            "<td>10</td>\n" +
            "<td>14</td>\n" +
            "<td>2208</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: C</td>\n" +
            "<td>Periodi 2</td>\n" +
            "<td>44-49</td>\n" +
            "<td>to</td>\n" +
            "<td>10</td>\n" +
            "<td>12</td>\n" +
            "<td>1487</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: B</td>\n" +
            "<td>Periodi 1</td>\n" +
            "<td>37-42</td>\n" +
            "<td>to</td>\n" +
            "<td>10</td>\n" +
            "<td>12</td>\n" +
            "<td>1487</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: A</td>\n" +
            "<td>Periodi 1</td>\n" +
            "<td>37-42</td>\n" +
            "<td>ma</td>\n" +
            "<td>12</td>\n" +
            "<td>14</td>\n" +
            "<td>1487</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: D</td>\n" +
            "<td>Periodi 3</td>\n" +
            "<td>2-7</td>\n" +
            "<td>ma</td>\n" +
            "<td>12</td>\n" +
            "<td>14</td>\n" +
            "<td>7343.1*</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: C</td>\n" +
            "<td>Periodi 2</td>\n" +
            "<td>44-49</td>\n" +
            "<td>ti</td>\n" +
            "<td>10</td>\n" +
            "<td>12</td>\n" +
            "<td>1488</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV12A1210 - Saksan peruskurssi 1: B</td>\n" +
            "<td>Periodi 1</td>\n" +
            "<td>37-42</td>\n" +
            "<td>ti</td>\n" +
            "<td>10</td>\n" +
            "<td>12</td>\n" +
            "<td>1487</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "</table>\n";
    private static final String LANGUAGE_LAB_FINNISH = "<table cellspacing='0' border='0' width='100%' class='header-2-args'>\n" +
            "<col align='left' /><col align='center' /><col align='right' />\n" +
            "  <tr>\n" +
            "    <td><span class='header-2-0-0'>FV18A9201 - Finnish 2</span></td><td></td><td></td>\n" +
            "  </tr>\n" +
            "</table>\n" +
            "</td>\n" +
            "</tr><tr>\n" +
            "<td>\n" +
            "<table cellspacing='0' border='0' width='100%' class='header-3-args'>\n" +
            "<col align='left' /><col align='center' /><col align='right' />\n" +
            "  <tr>\n" +
            "    <td></td><td></td><td></td>\n" +
            "  </tr>\n" +
            "</table>\n" +
            "</td>\n" +
            "</tr><tr>\n" +
            "<td>\n" +
            "<table cellspacing='0' border='0' width='100%' class='header-4-args'>\n" +
            "<col align='left' /><col align='center' /><col align='right' />\n" +
            "  <tr>\n" +
            "    <td></td><td></td><td></td>\n" +
            "  </tr>\n" +
            "</table>\n" +
            "</td>\n" +
            "</tr>\n" +
            "</table>\n" +
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
            "<td>FV18A9201 - Finnish 2: B</td>\n" +
            "<td>Periodi 2</td>\n" +
            "<td>44-49</td>\n" +
            "<td>to</td>\n" +
            "<td>14</td>\n" +
            "<td>16</td>\n" +
            "<td>4502</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV18A9201 - Finnish 2: A</td>\n" +
            "<td>Periodi 2</td>\n" +
            "<td>44-49</td>\n" +
            "<td>to</td>\n" +
            "<td>10</td>\n" +
            "<td>12</td>\n" +
            "<td>Yo-talo LS 213*</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV18A9201 - Finnish 2: C</td>\n" +
            "<td>Periodi 4</td>\n" +
            "<td>10-15</td>\n" +
            "<td>to</td>\n" +
            "<td>8</td>\n" +
            "<td>10</td>\n" +
            "<td>4509</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV18A9201 - Finnish 2: C</td>\n" +
            "<td>Periodi 4</td>\n" +
            "<td>10-15</td>\n" +
            "<td>ti</td>\n" +
            "<td>14</td>\n" +
            "<td>16</td>\n" +
            "<td>4502</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV18A9201 - Finnish 2: B</td>\n" +
            "<td>Periodi 2</td>\n" +
            "<td>44-49</td>\n" +
            "<td>ti</td>\n" +
            "<td>14</td>\n" +
            "<td>16</td>\n" +
            "<td>4505</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>FV18A9201 - Finnish 2: A</td>\n" +
            "<td>Periodi 2</td>\n" +
            "<td>44-49</td>\n" +
            "<td>ti</td>\n" +
            "<td>10</td>\n" +
            "<td>12</td>\n" +
            "<td>4502</td>\n" +
            "<td>&nbsp;</td>\n" +
            "</tr>\n" +
            "</table>\n";
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

    @Test
    public void HTMLDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(TITE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(COURSE_TEST_DATA);
        List<Course> list2 = courseHtmlParser.parseHTMLData(COURSE_TEST_DATA2);
        assertEquals("CT50A6000", list.get(0).courseCode);
        assertEquals("Pattern Recognition", list.get(0).courseName);
        assertEquals("CT30A9700", list2.get(0).courseCode);
        assertEquals("Network Security", list2.get(0).courseName);
    }

    @Test
    public void HTMLanguageFinnishParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(KIKE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(LANGUAGE_LAB_FINNISH);
        assertEquals("Finnish 2: B", list.get(0).courseName);
        assertEquals("FV18A9201", list.get(0).courseCode);
        assertEquals("4502", list.get(0).classroom);
        assertEquals("14-16", list.get(0).timeOfDay);
        assertEquals("to", list.get(0).weekDay);
        assertEquals("44,45,46,47,48,49", list.get(0).weekNumber);
        assertEquals("kike", list.get(0).department);
    }

    @Test
    public void HTMLanguageFrenchParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(KIKE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(LANGUAGE_LAB_FRENCH);
        assertEquals("Ranskan jatkokurssi 2: A", list.get(0).courseName);
        assertEquals("FV15A1420", list.get(0).courseCode);
        assertEquals("Yo-talo LS 205*", list.get(0).classroom);
        assertEquals("14-16", list.get(0).timeOfDay);
        assertEquals("ti", list.get(0).weekDay);
        assertEquals("10,11,12,13,14,15", list.get(0).weekNumber);
        assertEquals("A", list.get(0).groupName);
        assertEquals("kike", list.get(0).department);
    }

    @Test
    public void HTMLLanguageLabMultiGroupTest() throws Exception {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(KIKE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(LANGUAGE_LAB_MULTI);
        assertEquals("D", list.get(0).groupName);
        assertEquals("FV12A1210", list.get(0).courseCode);
        assertEquals("Saksan peruskurssi 1: D", list.get(0).courseName);
        assertEquals("B", list.get(list.size() - 1).groupName);
        assertEquals("FV12A1210", list.get(list.size() - 1).courseCode);
        assertEquals("Saksan peruskurssi 1: B", list.get(list.size() - 1).courseName);
        assertEquals(3, list.stream()
                .filter(c -> c.courseName.equals("Saksan peruskurssi 1: A"))
                .collect(Collectors.toList())
                .size());
        assertEquals(20, list.size());
    }

    @Test
    public void TutaDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(TUTA_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(PUPPA_TEST_DATA);
        assertEquals("Kustannusjohtamisen peruskurssi", list.get(0).courseName);
        assertEquals("CS31A0101", list.get(0).courseCode);
        assertEquals("Viipuri-sali*", list.get(0).classroom);
        assertEquals("15-17", list.get(0).timeOfDay);
        assertEquals("ti", list.get(0).weekDay);
        assertEquals("41", list.get(0).weekNumber);
        assertEquals("tuta", list.get(0).department);
    }

    @Test
    public void KatiDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(KATI_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(KATI_TEST_DATA);
        assertEquals("Makroteoria", list.get(0).courseName);
        assertEquals("A250A0350", list.get(0).courseCode);
        assertEquals("1382", list.get(0).classroom);
        assertEquals("9-15", list.get(0).timeOfDay);
        assertEquals("pe", list.get(0).weekDay);
        assertEquals("9", list.get(0).weekNumber);
        assertEquals("kati", list.get(0).department);
    }

    @Test
    public void YmteDataParsingTest() throws IOException {
        CourseHtmlParser courseHtmlParser = new CourseHtmlParser(YMTE_DEPARTMENT);
        List<Course> list = courseHtmlParser.parseHTMLData(YMTE_TEST_DATA);
        assertEquals("Ilmanvaihto- ja ilmastointitekniikka", list.get(0).courseName);
        assertEquals("BH60A1200", list.get(0).courseCode);
        assertEquals("ML 7439 (sini)*", list.get(0).classroom);
        assertEquals("10-12", list.get(0).timeOfDay);
        assertEquals("ke", list.get(0).weekDay);
        assertEquals("37,38,39,40,41,42,44,45,46,47,48,49", list.get(0).weekNumber);
        assertEquals("ymte", list.get(0).department);
    }

    @Test
    public void testDepartmentData() throws Exception {
        map = new URLParser().parseLinks();
        testCourseData(TITE_DEPARTMENT);
        testCourseData(KIKE_DEPARTMENT);
    }

    private void testCourseData(String department) {
        try {
            assertNotNull(map);
            final CourseHtmlParser courseHtmlParser = new CourseHtmlParser(department);
            courseHtmlParser.parse(map.get(department));
        } catch (Exception e) {
            LOGGER.error("test error", e);
        }
    }
}
