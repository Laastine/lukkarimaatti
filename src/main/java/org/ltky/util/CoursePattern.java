package org.ltky.util;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 29.11.2013
 */
public class CoursePattern {
    public String getKikeTeacher() {
        return "[A-Za-zÄäÖöÅå,\\- ]+";
    }

    public String getClassRoom() {
        return "[A-Z0-9a-zÄäÖö,.\\- *]+";
    }

    public String getTimeOfDay() {
        return "[0-9]{1,2}";
    }

    public String getCoursePattern() {
        return "^(CT|CS|BH|BL|BM|FV|BK|BJ|A1|A3){1}[0-9]{2}A[0-9]{4} - [A-ZÄÖ]{1}";
    }

    public String getCourseTypePattern() {
        return "/[A-Z+]";
    }

    public String getWeekNumber() {
        return "[0-9,\\- ]?";
    }

    public String getWeekDays() {
        return "(ma|ti|ke|to|pe|la|su)";
    }

    public String getKvPattern() {
        return "A3[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }

    public String getTitePattern() {
        return "C[TS]{1}[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }

    public String getKatiPattern() {
        return "A1[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }

    public String getKetePattern() {
        return "BJ[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }

    public String getKotePattern() {
        return "BK[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }

    public String getKikePattern() {
        return "FV[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }

    public String getMafyPattern() {
        return "BM[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }

    public String getSatePattern() {
        return "BL[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }

    public String getTutaPattern() {
        return "CS[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }

    public String getYmteEntePattern() {
        return "BH[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    }
}
