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

    public List<Course> parse(String url) throws IOException {
        return parseElementData(getTableElements(url));
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
        Document doc = Jsoup.parse(
                new URL(url).openStream(),
                "cp1252",   //Set to null to determine from http-equiv meta tag, if present, or fall back to UTF-8
                url);
        return doc.select("table").select(".spreadsheet").select(":not(thead) tr");
    }

    /**
     * Parses (HTML) table <td></td> -element data
     *
     * Language lab courses gets handled differently since they have 8 rows instead of normal 7
     * Language lab:
     * <td>FV11A2600 - Business English Reading Course: C</td>
     * <td>Taipale, Jukka</td>  #teacher
     * <td>Periodi 3</td>       #period
     * <td>2-8</td>             #weeks
     * <td>ke</td>              #week day
     * <td>10</td>              #start time
     * <td>12</td>              #end time
     * <td>1406</td>            #classroom
     *
     * Normal:
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
    private List parseElementData(Elements tableRowElements) throws UnsupportedEncodingException {
        final ArrayList<Course> resultList = new ArrayList();
        Course course = new Course();
        for (int i = 0; i < tableRowElements.size(); i++) {
            Elements rowItems = tableRowElements.get(i).select("td");
            for (int elem = 0; elem < rowItems.size(); elem++) {
                String item = new String(rowItems.get(elem).text().getBytes("cp1252"), "UTF-8");
                if (!"".equals(item)) {
                    course.setDepartment(department);
                    switch (elem) {
                        case 0:
                            if (stringHelper.extractPattern(item, coursePattern.getCoursePattern()))
                                course = findNameCodeAndType(item, course);
                            break;
                        case 1:
                            if (stringHelper.extractPattern(item, coursePattern.getKikeTeacher()) & department.equals("kike") &
                                    course.getTeacher().isEmpty())
                                course = findTeacher(item, course);
                            break;
                        case 2:
                            if (!department.equals("kike") & stringHelper.extractPattern(item, coursePattern.getWeekNumber()) &
                                    !"Vko".equals(item))
                                course = findWeek(item, course);
                            break;
                        case 3:
                            if (!department.equals("kike") & stringHelper.extractPattern(item, coursePattern.getWeekDays()))
                                course.setWeekDay(item);
                            else if (department.equals("kike") & stringHelper.extractPattern(item, coursePattern.getWeekNumber()))
                                course = findWeek(item, course);
                            break;
                        case 4:
                            final String endTime = new String(rowItems.get(elem + 1).text().getBytes("cp1252"), "UTF-8");
                            if (!department.equals("kike") & stringHelper.extractPattern(item, coursePattern.getTimeOfDay()) &
                                    stringHelper.extractPattern(endTime, coursePattern.getTimeOfDay()) &
                                    !"Klo".equals(item))
                                course.setTimeOfDay(item + "-" + endTime);
                            else if (department.equals("kike") & stringHelper.extractPattern(item, coursePattern.getWeekDays()))
                                course.setWeekDay(item);
                            break;
                        case 6:
                            final String languageLabEndTime = new String(rowItems.get(elem + 1).text().getBytes("cp1252"), "UTF-8");
                            if (!department.equals("kike") & stringHelper.extractPattern(item, coursePattern.getClassRoom()) & !"Sali".equals(item))
                                course.setClassroom(item);
                            else if (department.equals("kike") & stringHelper.extractPattern(item, coursePattern.getTimeOfDay()) &
                                    stringHelper.extractPattern(languageLabEndTime, coursePattern.getTimeOfDay()) &
                                    !"Klo".equals(item))
                                course.setTimeOfDay(item + "-" + languageLabEndTime);
                            break;
                        case 7:
                            if (department.equals("kike") & stringHelper.extractPattern(item, coursePattern.getClassRoom()) & !"Sali".equals(item))
                                course.setClassroom(item);
                            break;
                    }
                }
            }
            if (CourseValidator.validateCourse(course)) {
                LOGGER.debug("COURSE=" + course);
                resultList.add(course);
                course = new Course();
            }
        }
        return resultList;
    }

    private Course findTeacher(String teacher, Course course) {
        if (stringHelper.extractPattern(teacher, coursePattern.getKikeTeacher())) {
            course.setTeacher(teacher);
        } else {
            course.setTeacher(UNKNOWN);
        }
        return course;
    }

    private Course findWeek(String weekNumber, Course course) {
        if (stringHelper.extractPattern(weekNumber, coursePattern.getWeekNumber()))
            course.setWeekNumber(weekNumber);
        if (course.getWeekNumber() != null & !course.getWeekNumber().isEmpty()) {
            course.setPeriod(parsePeriod(course.getWeekNumber()));          //Set period
            return course;
        } else {
            return course;
        }
    }

    private Course findNameCodeAndType(String courseNameAndCode, Course course) {
        final String[] courseCodeAndNamePair = StringUtils.splitByWholeSeparator(courseNameAndCode, " - ");
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
        int weeks;
        try {
            weeks = Integer.parseInt(stringHelper.extractWeek(week));
        } catch (Exception e) {
            LOGGER.trace("Couldn't parse=" + week);
            return UNKNOWN;
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
