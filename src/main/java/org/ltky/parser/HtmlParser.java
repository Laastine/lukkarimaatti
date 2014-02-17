package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.ltky.entity.Course;
import org.ltky.util.CoursePattern;
import org.ltky.util.StringHelper;
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
class HtmlParser {
    private static final Logger LOGGER = Logger.getLogger(HtmlParser.class);
    private final String department;
    private final ParserConfiguration config = ParserConfiguration.getInstance();
    private final StringHelper stringHelper = new StringHelper();
    private final CoursePattern coursePattern = new CoursePattern();
    private static final String UNKNOWN = "?";

    public HtmlParser(String department) {
        this.department = department;
    }

    public void parse(String url) throws IOException {
        parseElementData(getTableElements(url));
        return;
    }


    /**
     * Select table class=spreadsheet elements from given HMTL
     *
     * @param url
     * @return
     * @throws IllegalStateException
     * @throws IOException
     */
    private Elements getTableElements(String url) throws IllegalStateException, IOException {
        Elements rowItems = null;
        Document doc = Jsoup.parse(
                new URL(url).openStream(),
                "cp1252",   //Set to null to determine from http-equiv meta tag, if present, or fall back to UTF-8
                url);
        Elements tableElements = doc.select("table");
        Elements plop = tableElements.select(".spreadsheet");
        Elements tableRowElements = plop.select(":not(thead) tr");
        return tableRowElements;
    }

    /**
     * Parses (HTML) table <td></td> -element data
     * @param tableRowElements
     * @return
     * @throws UnsupportedEncodingException
     */
    private List parseElementData(Elements tableRowElements) throws UnsupportedEncodingException {
        Course course = new Course();
        final ArrayList<Course> resultList = new ArrayList();
        for (int i = 0; i < tableRowElements.size(); i++) {
            Elements rowItems = tableRowElements.get(i).select("td");
            for (int elem = 0; elem < rowItems.size(); elem++) {
                String item = new String(rowItems.get(elem).text().getBytes("cp1252"), "UTF-8");
                if (!"".equals(item)) {
                    switch (elem) {
                        case 0:
                            if (stringHelper.extractPattern(item, coursePattern.getCoursePattern()) != null) {
                                course = findNameAndCode(item, new String(rowItems.get(elem + 1).text().getBytes("cp1252"), "UTF-8"), course);
                                course.setDepartment(department);
                            }
                            break;
                        case 2:
                            if (stringHelper.extractPattern(item, coursePattern.getWeekNumber()) != null && !"Vko".equals(item))
                                course = findWeek(item, course);
                            break;
                        case 3:
                            if (stringHelper.extractPattern(item, coursePattern.getWeekDays()) != null)
                                course.setWeekDay(item);
                            break;
                        case 4:
                            final String endTime = new String(rowItems.get(elem + 1).text().getBytes("cp1252"), "UTF-8");
                            if (stringHelper.extractPattern(item, coursePattern.getTimeOfDay()) != null &
                                    stringHelper.extractPattern(endTime, coursePattern.getTimeOfDay()) != null && !"Klo".equals(item))
                                course.setTimeOfDay(item + "-" + endTime);
                            break;
                        case 6:
                            if (stringHelper.extractPattern(item, coursePattern.getClassRoom()) != null && !"Sali".equals(item))
                                course.setClassroom(item);
                            break;
                        case 7:
                            break;
                    }
                }
                if (CourseValidator.validateCourse(course)) {
                LOGGER.debug("COURSE=" + course);
                resultList.add(course);
                course = new Course();
                }

            }
        }
        return resultList;
    }

    private Course findTeacher(String teacher, Course course) {
        if (stringHelper.extractPattern(teacher, coursePattern.getKikeTeacher()) != null) {
            course.setTeacher(teacher);
        } else {
            course.setTeacher(UNKNOWN);
        }
        return course;
    }

    private Course findWeek(String weekNumber, Course course) {
        course.setWeekNumber(stringHelper.extractPattern(weekNumber, coursePattern.getWeekNumber()));
        if (course.getWeekNumber() != null & !course.getWeekNumber().isEmpty()) {
            course.setPeriod(parsePeriod(course.getWeekNumber()));          //Set period
            return course;
        } else {
            return course;
        }
    }

    private Course findNameAndCode(String courseNameAndCode, String teacher, Course course) {
        final String[] courseCodeAndNamePair = StringUtils.splitByWholeSeparator(courseNameAndCode, " - ");
        course.setCourseCode(courseCodeAndNamePair[0]);
        course.setCourseName(StringUtils.substringBefore(courseCodeAndNamePair[1], "/"));
        course.setType(StringUtils.substringAfterLast(courseCodeAndNamePair[1], "/"));

        if (department.equals("kike") && course.getTeacher().isEmpty()) {
            if (stringHelper.extractPattern(teacher, coursePattern.getKikeTeacher()) != null) {
                course = findTeacher(teacher, course);
            }
        }
        return course;
    }

    /**
     * Parse period (1-4) from given string
     *
     * @param week
     * @return
     */
    private String parsePeriod(String week) {
        int weeks;
        week = stringHelper.extractPattern(week, "(^[0-9]{2}|^[1-9])");
        try {
            weeks = Integer.parseInt(week);
        } catch (Exception e) {
            LOGGER.error("Couldn't parse=" + week);
            return "";
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
