package org.ltky.model;

import org.ltky.util.StringHelper;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
@XmlRootElement
public class Course implements Serializable {

    @XmlElement(name = "courseId")
    private Integer courseId;
    @XmlElement(name = "courseCode")
    private String courseCode = "";
    @XmlElement(name = "courseName")
    private String courseName = "";
    @XmlElement(name = "period")
    private String period = "";
    @XmlElement(name = "weekNumber")
    private String weekNumber = "";
    @XmlElement(name = "weekDay")
    private String weekDay = "";
    @XmlElement(name = "timeOfDay")
    private String timeOfDay = "";
    @XmlElement(name = "classroom")
    private String classroom = "";
    @XmlElement(name = "type")
    private String type = "";
    @XmlElement(name = "department")
    private String department = "";

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(String weekNumber) {
        this.weekNumber = weekNumber;
    }

    public String getTimeOfDay() {
        return timeOfDay;
    }

    public void setTimeOfDay(String timeOfDay) {
        this.timeOfDay = timeOfDay;
    }

    public String getClassroom() {
        return classroom;
    }

    public void setClassroom(String classroom) {
        this.classroom = classroom;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getWeekDay() {
        return weekDay;
    }

    public void setWeekDay(String weekDay) {
        this.weekDay = weekDay;
    }

    @Override
    public String toString() {
        String course = "Course [courseId="+courseId+", courseCode="+courseCode+", courseName="+courseName+
                ", weekNumber="+ weekNumber +", weekDay="+weekDay+", period="+period+", timeOfDay="+timeOfDay+
                ", classroom="+classroom+", type="+type+", department="+department+"]";
        String encoding = new StringHelper().checkEncoding(courseId+courseCode+courseName+weekNumber+weekDay+period+timeOfDay+classroom+type+department+courseId+courseCode+courseName+weekNumber+weekDay+period+timeOfDay+classroom+type+department+courseId+courseCode+courseName+weekNumber+weekDay+period+timeOfDay+classroom+type+department+courseId+courseCode+courseName+weekNumber+weekDay+period+timeOfDay+classroom+type+department+courseId+courseCode+courseName+weekNumber+weekDay+period+timeOfDay+classroom+type+department);
        return course+"|"+encoding;
    }
}
