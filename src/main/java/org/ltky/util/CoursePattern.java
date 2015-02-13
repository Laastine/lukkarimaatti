package org.ltky.util;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 29.11.2013
 */
public class CoursePattern {
    public static String examDate = "[0-9]{1,2}.[0-9]{1,2}/[0-9]{1,2}";
    public static String kikeTeacher = "^[A-ZÄÖÅ][A-Za-zÄäÖöÅå,\\- ]+";
    public static String classRoom = "[A-Z0-9a-zÄäÖö,.\\- *]+";
    public static String timeOfDay = "^([0-9]|0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){0,1}$";
    public static String coursePattern = "^(CT|CS|BH|BL|BM|FV|BK|BJ|A1|A3){1}[0-9]{2}A[0-9]{4} - [A-ZÄÖ]{1}";
    public static String courseTypePattern = "/[A-Z+]";
    public static String weekNumber = "^[0-9,\\- ]+$";
    public static String weekDays = "(ma|ti|ke|to|pe|la|su)";
    public static String kvPattern = "A3[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String titePattern = "C[TS]{1}[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String katiPattern = "A1[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String ketePattern = "BJ[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String kotePattern = "BK[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String kikePattern = "FV[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String mafyPattern = "BM[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String satePattern = "BL[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String tutaPattern = "CS[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String ymtePattern = "BH60A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    public static String entePattern = "BH[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
}
