package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.ltky.entity.Course;
import org.ltky.util.CoursePattern;
import org.ltky.util.StringHelper;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 28.11.2013
 */
public class HtmlParser {
    private static final Logger logger = Logger.getLogger(HtmlParser.class);
    private ArrayList<String> html;
    private String department;
    private ArrayList<String> resultList = new ArrayList<>();
    private ParserConfiguration config = ParserConfiguration.getInstance();
    private final StringHelper stringHelper = new StringHelper();
    private final CoursePattern coursePattern = new CoursePattern();

    public HtmlParser(String html, String department) throws Exception {
        try {
            this.department = department;
            this.html = stripHtmlTags(html);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Parse HTML table values with UTF-8 encoding
     *
     * @param html
     * @return
     * @throws IllegalStateException
     */
    private ArrayList<String> stripHtmlTags(String html) throws IllegalStateException, UnsupportedEncodingException {
        Document doc = Jsoup.parse(stringHelper.changeEncoding(html, "cp1252", "UTF-8"));
        Elements tableElements = doc.select("table");
        Elements tableRowElements = tableElements.select(":not(thead) tr");
        for (int i = 0; i < tableRowElements.size(); i++) {
            Elements rowItems = tableRowElements.get(i).select("td");
            for (int j = 0; j < rowItems.size(); j++) {
                String tmp = rowItems.get(j).text();
                if (!tmp.isEmpty()) {
                    //logger.debug("row=" + tmp);
                    resultList.add(tmp);
                }
            }
        }
        return resultList;
    }

    /**
     * Create course object list from given course data
     *
     * @param coursesList
     * @return
     */
    public List<Course> formatEachEducationEvent(ArrayList<String> coursesList) throws Exception {
        Course course = new Course();
        ArrayList<Course> resultSet = new ArrayList();
        for (int i = 0; i < coursesList.size(); i++) {
            if (findUselessLine(coursesList.get(i))) {
                //Skip the line
            } else if (stringHelper.extractPattern(coursesList.get(i), coursePattern.getCoursePattern()) != null) {     //Set courseCode and courseName
                if (course.getCourseCode().isEmpty() && course.getCourseName().isEmpty()) {
                    course = findNameAndCode(coursesList.get(i), course);
                }
            } else if (stringHelper.extractPattern(coursesList.get(i), coursePattern.getWeekNumber()) != null) {        //Set weekNumber
                if (course.getWeekNumber().isEmpty()) {
                    course = findWeek(coursesList.get(i), course);
                }
            } else if (stringHelper.extractPattern(coursesList.get(i), coursePattern.getWeekDays()) != null) {          //Set weekDay, timeOfDay and classroom
                if (course.getWeekDay().isEmpty()) {
                    course = findCourseTimeAndPlace(coursesList.get(i), coursesList.get(i + 1), coursesList.get(i + 2), coursesList.get(i + 3), course);
                    resultSet.add(course);
                    course = new Course();
                }
            } else if (coursesList.get(i).equals("____________________________________")) {
                //logger.debug("New course" + course.toString());
                course = new Course();
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
        if (line == null | line.isEmpty() | line.equals("Periodi") |
                line.equals("Vko") | line.equals("Klo") | line.equals("Sali")) {
            return true;
        } else {
            return false;
        }
    }

    private Course findCourseTimeAndPlace(String weekDay, String startTime, String endTime, String classRoom, Course course) {
        //logger.debug("Set weekDay=" + weekDay);
        course.setWeekDay(stringHelper.extractPattern(weekDay, coursePattern.getWeekDays()));
        //logger.debug("Set timeOfDay="+startTime+"-"+endTime);
        course.setTimeOfDay(stringHelper.extractPattern(startTime, coursePattern.getTimeOfDay()) + //Set timeOfDay
                "-" + stringHelper.extractPattern(endTime, coursePattern.getTimeOfDay()));
        if (!classRoom.isEmpty() & classRoom != null) {
            course.setClassroom(classRoom);                                                //Set classRoom
        } else {
            course.setClassroom("?");
        }
        course.setDepartment(this.department);
        if (logger.isDebugEnabled()) {
            logger.info("Adding course: " + course.toString());
        }
        return course;
    }

    private Course findWeek(String weekNumber, Course course) {
        //logger.debug("Set weekNumber="+weekNumber);
        course.setWeekNumber(stringHelper.extractPattern(weekNumber, coursePattern.getWeekNumber()));
        if (course.getWeekNumber() != null & !course.getWeekNumber().isEmpty()) {
            logger.debug("Period data="+weekNumber);
            course.setPeriod(parsePeriod(course.getWeekNumber()));          //Set period
            return course;
        } else {
            return course;
        }
    }

    private Course findNameAndCode(String courseNameAndCode, Course course) {
        String[] courseCodeAndNamePair = StringUtils.splitByWholeSeparator(courseNameAndCode, " - ");
        course.setCourseCode(courseCodeAndNamePair[0]);
        course.setCourseName(courseCodeAndNamePair[1]);
        course.setType(parseEducationEventType(course.getCourseName()));
        //logger.debug(courseCodeAndNamePair[0] + " " + courseCodeAndNamePair[1]);
        return course;
    }

    public ArrayList<String> getResultList() {
        return resultList;
    }

    /**
     * Check education event type
     *
     * @param educationEvent
     * @return
     */
    private String parseEducationEventType(String educationEvent) {
        return StringUtils.substringAfter(educationEvent, "/");
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
            logger.error("Couldn't parse=" + week);
            return "";
        }
        int period1 = Integer.valueOf(config.getPeriod1());
        int period2 = Integer.valueOf(config.getPeriod2());
        int period3 = Integer.valueOf(config.getPeriod3());
        int period4 = Integer.valueOf(config.getPeriod4());
        if ((period3 <= weeks) & (weeks < period4)) {
            logger.debug(weeks + "=3");
            return "3";
        } else if ((period4 <= weeks) & (weeks < period1)) {
            logger.debug(weeks + "=4");
            return "4";
        } else if ((period1 <= weeks) & (weeks < period2)) {
            logger.debug(weeks + "=1");
            return "1";
        } else if ((period2 <= weeks) & (weeks < 52)) {
            logger.debug(weeks + "=2");
            return "2";
        } else {
            logger.debug(weeks + "=?");
            return "?";
        }
    }
}
