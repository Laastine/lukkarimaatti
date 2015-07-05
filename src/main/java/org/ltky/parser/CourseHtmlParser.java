package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.ltky.dao.model.Course;
import org.ltky.util.CoursePattern;
import org.ltky.util.Util;
import org.ltky.validator.CourseValidator;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 28.11.2013
 */
public class CourseHtmlParser {
    private static final String UNKNOWN = "?";
    private final String department;
    private final Util UTIL = Util.getInstance();
    private final CoursePattern coursePattern = new CoursePattern();
    private static final Logger LOGGER = Logger.getLogger(CourseHtmlParser.class);

    public CourseHtmlParser(String department) {
        this.department = department;
    }

    public List<Course> parse(String url) throws IOException {
        return parseElementsData(getTableElements(getUrlData(url)));
    }

    public List<Course> parseHTMLData(String html) {
        return parseElementsData(getTableElements(Jsoup.parse(html)));
    }

    /**
     * Fetch HTML string
     *
     * @param url
     * @return
     * @throws IOException
     */
    private Document getUrlData(String url) throws IOException {
        return Jsoup.parse(
                new URL(url).openStream(),
                "cp1252",   //Set to null to determine from http-equiv meta tag, if present, or fall back to UTF-8
                url);
    }

    /**
     * Select table class=spreadsheet elements from given HMTL string
     *
     * @param doc
     * @return
     * @throws IllegalStateException
     * @throws IOException
     */
    private Elements getTableElements(Document doc) throws IllegalStateException {
        return doc.select("table").select(".spreadsheet").select(":not(thead) tr");
    }

    /**
     * Parses (HTML) table <td></td> -element data
     * e.g.
     * <p>
     * <td>CT50A5700 - Introduction to Computer Graphics/L</td>
     * <td>Periodi 2</td>       #period
     * <td>43-49</td>           #weeks
     * <td>ti</td>              #week day
     * <td>12</td>              #start time
     * <td>13</td>              #end time
     * <td>1217</td>            #classroom
     *
     * @param tableRowElements
     * @return
     * @throws UnsupportedEncodingException
     */
    private List parseElementsData(Elements tableRowElements) {
        final List<Course> resultList = new ArrayList();
        tableRowElements.stream().forEach(t -> {
            Course course = parseTableElement(t.select("td"));
            if (CourseValidator.validateCourse(course)) {
                resultList.add(course);
            }
        });
        return resultList;
    }

    private Course parseTableElement(Elements rowItems) {
        if (this.department.equalsIgnoreCase("kike")) {
            CoursePrototype coursePrototype = findNameCodeAndType(getElement(rowItems, 0));
            return new Course(
                    coursePrototype.courseCode,                                                 //courseCode
                    coursePrototype.courseName,                                                 //courseName
                    (findWeek(getElement(rowItems, 3))),                                        //weekNumber
                    (findWeekDay(getElement(rowItems, 4))),                                     //weekDay
                    (findTimeOfDay(getElement(rowItems, 5), getElement(rowItems, 6))),          //timeOfDay
                    (findClassroom(getElement(rowItems, 7))),                                   //classRoom
                    (coursePrototype.type),                                                     //type
                    department,                                                                 //department
                    (findTeacher(getElement(rowItems, 1))),                                     //teacher
                    (findMiscData(getElement(rowItems, 8))),                                    //misc
                    coursePrototype.group
            );
        } else {
            CoursePrototype coursePrototype = findNameCodeAndType(getElement(rowItems, 0));
            return new Course(
                    coursePrototype.courseCode,                                             //courseCode
                    coursePrototype.courseName,                                             //courseName
                    findWeek(getElement(rowItems, 2)),                                      //weekNumber
                    findWeekDay(getElement(rowItems, 3)),                                   //weekDay
                    findTimeOfDay(getElement(rowItems, 4), getElement(rowItems, 5)),        //timeOfDay
                    findClassroom(getElement(rowItems, 6)),                                 //classRoom
                    coursePrototype.type,                                                   //type
                    department,                                                             //department
                    findTeacher(getElement(rowItems, 1)),                                   //teacher
                    findMiscData(getElement(rowItems, 7)),                                  //misc
                    coursePrototype.group                                                   //groupName
            );
        }
    }

    private String getElement(Elements rowItems, int elementIndex) {
        try {
            return new String(rowItems.get(elementIndex).text().getBytes("cp1252"), "UTF-8").trim();
        } catch (Exception e) {
            return "";
        }
    }

    private String findTimeOfDay(String startTime, String endTime) {
        if (UTIL.extractPattern(startTime, coursePattern.timeOfDay) &
                UTIL.extractPattern(endTime, coursePattern.timeOfDay) &
                !"Klo".equals(startTime))
            if (StringUtils.contains(startTime, ":00") || StringUtils.contains(endTime, ":00")) {
                return StringUtils.removeEndIgnoreCase(startTime, ":00") + "-" + StringUtils.removeEndIgnoreCase(endTime, ":00");
            } else {
                return startTime + "-" + endTime;
            }
        return "";
    }

    private String findGroup(String courseName) {
        String separator = ": ", groupLetter = "";
        if (StringUtils.contains(courseName, separator) && this.department.equalsIgnoreCase("kike")) {
            String lastCharacter = StringUtils.substringAfterLast(courseName, separator);
            LOGGER.debug("lastCharacter=" + lastCharacter);
            if (StringUtils.isAlpha(lastCharacter) && StringUtils.isAllUpperCase(lastCharacter) && lastCharacter.length() == 1) {
                groupLetter = lastCharacter;
            }
        }
        return groupLetter;
    }

    private String findMiscData(String misc) {
        return StringUtils.isNotBlank(misc) ? misc : UNKNOWN;
    }

    private String findTeacher(String teacher) {
        return UTIL.extractPattern(teacher, coursePattern.kikeTeacher) ? teacher : UNKNOWN;
    }

    private String findWeek(String weekNumber) {
        return UTIL.extractPattern(weekNumber, coursePattern.weekNumber) ? UTIL.processWeekNumbers(weekNumber) : UNKNOWN;
    }

    private String findWeekDay(String weekDay) {
        return UTIL.extractPattern(weekDay, coursePattern.weekDays) ? weekDay : UNKNOWN;
    }

    private String findClassroom(String classroom) {
        return UTIL.extractPattern(classroom, coursePattern.classRoom) ? classroom : UNKNOWN;
    }

    private CoursePrototype findNameCodeAndType(String courseNameAndCode) {
        if (StringUtils.isBlank(courseNameAndCode)) {
            return new CoursePrototype("", "", "");
        }
        String[] courseCodeAndNamePair = StringUtils.splitByWholeSeparator(courseNameAndCode, " - ");
        if (courseCodeAndNamePair.length < 2) {
            courseCodeAndNamePair = StringUtils.splitByWholeSeparator(courseNameAndCode, "- ");
        }
        return new CoursePrototype(courseCodeAndNamePair[0], StringUtils.substringBefore(courseCodeAndNamePair[1], "/"), StringUtils.substringAfterLast(courseCodeAndNamePair[1], "/"));
    }

    private class CoursePrototype {
        final String courseCode;
        final String courseName;
        final String type;
        final String group;

        public CoursePrototype(String courseCode, String courseName, String type) {
            this.courseCode = courseCode;
            this.courseName = courseName;
            this.group = findGroup(courseName);
            this.type = type;
        }
    }
}
