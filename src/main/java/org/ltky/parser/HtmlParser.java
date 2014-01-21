package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.ltky.entity.Course;
import org.ltky.util.CoursePattern;
import org.ltky.util.StringHelper;

import java.io.IOException;
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
    private final ArrayList<String> resultList = new ArrayList<>();
    private final ParserConfiguration config = ParserConfiguration.getInstance();
    private final StringHelper stringHelper = new StringHelper();
    private final CoursePattern coursePattern = new CoursePattern();
    private static final String UNKNOWN = "?";

    public HtmlParser(String url, String department) throws IOException {
        this.department = department;
        stripHtmlTags(url);
    }

    /**
     * Parse HTML table values with UTF-8 encoding
     *
     * @param url
     * @return
     * @throws IllegalStateException
     */
    private void stripHtmlTags(String url) throws IllegalStateException, IOException {
        final StringHelper stringHelper = new StringHelper();
        Document doc = Jsoup.parse(
                new URL(url).openStream(),
                "cp1252",   //Set to null to determine from http-equiv meta tag, if present, or fall back to UTF-8
                url);
        Elements tableElements = doc.select("table");
        Elements tableRowElements = tableElements.select(":not(thead) tr");
        for (int i = 0; i < tableRowElements.size(); i++) {
            Elements rowItems = tableRowElements.get(i).select("td");
            for (int j = 0; j < rowItems.size(); j++) {
                String tmp = rowItems.get(j).text();
                if (!tmp.isEmpty()) {
                    resultList.add(new String(tmp.getBytes("cp1252"), "UTF-8"));
                }
            }
        }
    }

    /**
     * Create course object list from given course data
     *
     * @param coursesList
     * @return
     */
    public List<Course> formatEachEducationEvent(final ArrayList<String> coursesList) {
        Course course = new Course();
        List<Course> resultSet = new ArrayList<>();
        for (int i = 0; i < coursesList.size(); i++) {
            if (findUselessLine(coursesList.get(i))) {
                //Skip the line
            } else if (stringHelper.extractPattern(coursesList.get(i), coursePattern.getCoursePattern()) != null) {     //Set courseCode and courseName
                if (course.getCourseCode().isEmpty() && course.getCourseName().isEmpty()) {
                    course = findNameAndCode(coursesList.get(i), coursesList.get(i+1), course);
                }
            } else if (stringHelper.extractPattern(coursesList.get(i), coursePattern.getWeekNumber()) != null) {        //Set weekNumber
                    course = findWeek(coursesList.get(i), course);
            } else if (stringHelper.extractPattern(coursesList.get(i), coursePattern.getWeekDays()) != null) {          //Set weekDay, timeOfDay and classroom
                if (course.getWeekDay().isEmpty()) {
                    course = findCourseTimeAndPlace(coursesList.get(i), coursesList.get(i + 1), coursesList.get(i + 2), coursesList.get(i + 3), course);
                    resultSet.add(course);
                    course = new Course();
                }
            } else if (coursesList.get(i).equals("____________________________________") &&
                    coursesList.get(i+1).equals("____________________________________") &&
                    coursesList.get(i+2).equals("____________________________________")) {
                course = new Course();
                i+=6;   //Jump over irrelevant lines
            }
        }
        return resultSet;
    }

    /**
     * Detect useless string
     *
     * @param line
     * @return
     */
    private boolean findUselessLine(String line) {
        if (line == null)
            return true;
        else
            return line.isEmpty() | line.equals("Periodi") | line.equals("Vko") | line.equals("Klo") | line.equals("Sali") | line.equals("?");
    }

    private Course findTeacher(String teacher, Course course) {
        if (stringHelper.extractPattern(teacher, coursePattern.getKikeTeacher()) != null) {
            course.setTeacher(teacher);
        } else {
            course.setTeacher(UNKNOWN);
        }
        return course;
    }

    private Course findCourseTimeAndPlace(String weekDay, String startTime, String endTime, String classRoom, Course course) {
        if (stringHelper.extractPattern(weekDay, coursePattern.getWeekDays()) != null)
            course.setWeekDay(weekDay);
        else
            course.setWeekDay(UNKNOWN);
        if (stringHelper.extractPattern(startTime, coursePattern.getTimeOfDay()) != null & stringHelper.extractPattern(endTime, coursePattern.getTimeOfDay()) != null)
            course.setTimeOfDay(startTime + "-" + endTime);    //Set timeOfDay
        if (!classRoom.isEmpty() & classRoom != null & stringHelper.extractPattern(classRoom, coursePattern.getClassRoom()) != null) {
            course.setClassroom(classRoom);     //Set classRoom
        } else {
            course.setClassroom(UNKNOWN);
        }
        course.setDepartment(this.department);
        if (LOGGER.isDebugEnabled()) {
            LOGGER.info("Adding course=" + course.toString());
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

        //LOGGER.debug(courseCodeAndNamePair[0] + " " + courseCodeAndNamePair[1]);
        return course;
    }

    public ArrayList<String> getResultList() {
        return resultList;
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
