package org.ltky.util;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 29.11.2013
 */
public class CoursePattern {
    public static String kikeTeacher = "^[A-ZÄÖÅ][A-Za-zÄäÖöÅå,\\- ]+";
    public static String classRoom = "[A-Z0-9a-zÄäÖö,.\\- *]+";
    public static String timeOfDay = "^([0-9]|0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){0,1}$";
    public static String weekNumber = "^[0-9,\\- ]+$";
    public static String weekDays = "(ma|ti|ke|to|pe|la|su)";
}
