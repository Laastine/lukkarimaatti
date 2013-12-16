package org.ltky.util;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 29.11.2013
 */
public class CoursePattern {
    private final String titePattern = "C[TS]{1}[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String ymteEntePattern = "BH[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String tutaPattern = "CS[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String satePattern = "BL[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String mafyPattern = "BM[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String kikePattern = "FV[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String kotePattern = "BK[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String ketePattern = "BJ[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String katiPattern = "A1[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String kvPattern = "A3[0-9]{2}A[0-9]{4} - [A-Za-zÄäÖö,.\\- ]+[ ]{1}";
    private final String weekDays = "(ma|ti|ke|to|pe|la|su)";
    private final String timeOfDay = "[0-9]{1,2}";
    private final String coursePattern = "^(CT|CS|BH|BL|BM|FV|BK|BJ|A1|A3){1}[0-9]{2}A[0-9]{4} - [A-ZÄÖ]{1}";
    private final String weekNumber = "[0-9,\\- ]+";
    private final String courseTypePattern = "/[A-Z+]";
    private final String classRoom = "[A-Z0-9a-zÄäÖö,.\\- *]+";

    public String getClassRoom() {
        return classRoom;
    }

    public String getTimeOfDay() {
        return timeOfDay;
    }

    public String getCoursePattern() {
        return coursePattern;
    }

    public String getCourseTypePattern() {
        return courseTypePattern;
    }

    public String getWeekNumber() {
        return weekNumber;
    }

    public String getWeekDays() {
        return weekDays;
    }

    public String getKvPattern() {
        return kvPattern;
    }

    public String getTitePattern() {
        return titePattern;
    }

    public String getKatiPattern() {
        return katiPattern;
    }

    public String getKetePattern() {
        return ketePattern;
    }

    public String getKotePattern() {
        return kotePattern;
    }

    public String getKikePattern() {
        return kikePattern;
    }

    public String getMafyPattern() {
        return mafyPattern;
    }

    public String getSatePattern() {
        return satePattern;
    }

    public String getTutaPattern() {
        return tutaPattern;
    }

    public String getYmteEntePattern() {
        return ymteEntePattern;
    }
}
