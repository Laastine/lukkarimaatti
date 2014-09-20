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
    private static final Logger LOGGER = Logger.getLogger(CourseHtmlParser.class);
    private static final String UNKNOWN = "?";
    private final String department;
    private final ParserConfiguration config = ParserConfiguration.getInstance();
    private final Util UTIL = Util.getInstance();
    private final CoursePattern coursePattern = new CoursePattern();

    public CourseHtmlParser(String department) {
        this.department = department;
    }

    public List<Course> parse(String url) throws IOException {
        return parseElementsData(getTableElements(getUrlData(url)));
    }

    public List<Course> parseHTMLData(String html) throws IOException {
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
            Elements rowItems = t.select("td");
            Course course = parseTableElement(rowItems);
            if (CourseValidator.validateCourse(course)) {
                resultList.add(course);
            }
        });
        return resultList;
    }

    private Course parseTableElement(Elements rowItems) {
        Course course = new Course();
        for (int elementIndex = 0; elementIndex < rowItems.size(); elementIndex++) {
            try {
                String item = new String(rowItems.get(elementIndex).text().getBytes("cp1252"), "UTF-8").trim();
                course.setDepartment(department);
                if (!course.getDepartment().equals("kike")) {
                    course = parseNormalCourse(course, rowItems, elementIndex, item);
                } else {
                    course = parseLanguageLabCourse(course, rowItems, elementIndex, item);
                }
            } catch (UnsupportedEncodingException e) {
                LOGGER.error("Encoding conversion error ", e);
            }
        }
        return course;
    }

    private Course parseNormalCourse(Course course, Elements rowItems, Integer elem, String item) throws UnsupportedEncodingException {
        if (StringUtils.isBlank(item)) {
            return course;
        }
        switch (elem) {
            case 0:
                if (UTIL.extractPattern(item, coursePattern.getCoursePattern()))
                    course = findNameCodeAndType(item, course);
                break;
            case 2:
                if (UTIL.extractPattern(item, coursePattern.getWeekNumber()) & !"Vko".equals(item))
                    course = findWeek(item, course);
                break;
            case 3:
                if (UTIL.extractPattern(item, coursePattern.getWeekDays()))
                    course = findWeekDay(item, course);
                break;
            case 4:
                final String endTime = new String(rowItems.get(elem + 1).text().getBytes("cp1252"), "UTF-8");
                if (UTIL.extractPattern(item, coursePattern.getTimeOfDay()) &
                        UTIL.extractPattern(endTime, coursePattern.getTimeOfDay()) &
                        !"Klo".equals(item))
                    if (StringUtils.contains(item, ":00") || StringUtils.contains(endTime, ":00")) {
                        course.setTimeOfDay(StringUtils.removeEndIgnoreCase(item, ":00") + "-" + StringUtils.removeEndIgnoreCase(endTime, ":00"));
                    } else {
                        course.setTimeOfDay(item + "-" + endTime);
                    }
                break;
            case 6:
                if (UTIL.extractPattern(item, coursePattern.getClassRoom()) & !"Sali".equals(item))
                    course = findClassroom(item, course);
                break;
        }
        return course;
    }

    private Course parseLanguageLabCourse(Course course, Elements rowItems, int elem, String item) throws UnsupportedEncodingException {
        if (StringUtils.isBlank(item)) {
            return course;
        }
        switch (elem) {
            case 0:
                if (UTIL.extractPattern(item, coursePattern.getCoursePattern()))
                    course = findNameCodeAndType(item, course);
                break;
            case 1:
                if (UTIL.extractPattern(item, coursePattern.getKikeTeacher()))
                    course = findTeacher(item, course);
                break;
            case 3:
                if (UTIL.extractPattern(item, coursePattern.getWeekNumber()) & !"Vko".equals(item))
                    course = findWeek(item, course);
                break;
            case 4:
                if (UTIL.extractPattern(item, coursePattern.getWeekDays()))
                    course = findWeekDay(item, course);
                break;
            case 5:
                final String endTime = new String(rowItems.get(elem + 1).text().getBytes("cp1252"), "UTF-8");
                if (UTIL.extractPattern(item, coursePattern.getTimeOfDay()) &
                        UTIL.extractPattern(endTime, coursePattern.getTimeOfDay()) &
                        !"Klo".equals(item)) {
                    course.setTimeOfDay(item + "-" + endTime);
                }
                break;
            case 7:
                if (UTIL.extractPattern(item, coursePattern.getClassRoom()) & !"Sali".equals(item))
                    course = findClassroom(item, course);
                break;
            case 8:
                course = findMiscData(item, course);
                break;
        }
        return course;
    }

    private Course findMiscData(String misc, Course course) {
        if (StringUtils.isBlank(misc)) {
            course.setMisc(UNKNOWN);
        } else {
            course.setMisc(misc);
        }
        return course;
    }

    private Course findTeacher(String teacher, Course course) {
        if (UTIL.extractPattern(teacher, coursePattern.getKikeTeacher())) {
            course.setTeacher(teacher);
        } else {
            course.setTeacher(UNKNOWN);
        }
        return course;
    }

    private Course findWeek(String weekNumber, Course course) {
        if (UTIL.extractPattern(weekNumber, coursePattern.getWeekNumber()))
            course.setWeekNumber(UTIL.processWeekNumbers(weekNumber));
        if (StringUtils.isBlank(course.getPeriod())) {
            course.setPeriod(parsePeriod(course.getWeekNumber()));          //Set period
            return course;
        } else {
            course.setPeriod(UNKNOWN);
            return course;
        }
    }

    private Course findWeekDay(String weekDay, Course course) {
        if (UTIL.extractPattern(weekDay, coursePattern.getWeekDays())) {
            course.setWeekDay(weekDay);
            return course;
        } else {
            course.setWeekDay(UNKNOWN);
            return course;
        }
    }

    private Course findClassroom(String classroom, Course course) {
        if (UTIL.extractPattern(classroom, coursePattern.getClassRoom())) {
            course.setClassroom(classroom);
            return course;
        } else {
            course.setClassroom(UNKNOWN);
            return course;
        }
    }

    private Course findNameCodeAndType(String courseNameAndCode, Course course) {
        String[] courseCodeAndNamePair = StringUtils.splitByWholeSeparator(courseNameAndCode, " - ");
        if (courseCodeAndNamePair.length < 2) {
            courseCodeAndNamePair = StringUtils.splitByWholeSeparator(courseNameAndCode, "- ");
        }
        course.setCourseCode(courseCodeAndNamePair[0]);
        course.setCourseName(StringUtils.substringBefore(courseCodeAndNamePair[1], "/"));
        course.setType(StringUtils.substringAfterLast(courseCodeAndNamePair[1], "/"));
        return course;
    }

    /**
     * Parse period (1-4) from given string
     *
     * @param week
     * @return
     */
    private String parsePeriod(String week) {
        Integer weeks;
        try {
            weeks = Integer.parseInt(UTIL.extractWeek(week));
        } catch (Exception e) {
            LOGGER.error("Couldn't parse=" + week);
            weeks = 0;
        }
        if (weeks == null) {
            weeks = 0;
        }
        int period1 = Integer.valueOf(config.getPeriod1());
        int period2 = Integer.valueOf(config.getPeriod2());
        int period3 = Integer.valueOf(config.getPeriod3());
        int period4 = Integer.valueOf(config.getPeriod4());
        if ((period3 <= weeks) & (weeks < period4)) {
            return "3";
        } else if ((period4 <= weeks) & (weeks < period1)) {
            return "4";
        } else if ((period1 <= weeks) & (weeks < period2)) {
            return "1";
        } else if ((period2 <= weeks) & (weeks < 52)) {
            return "2";
        } else {
            return UNKNOWN;
        }
    }
}