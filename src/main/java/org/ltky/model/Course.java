package org.ltky.model;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.Immutable;

import javax.persistence.*;
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
@Entity
@Immutable
@Table(name = "COURSE")
public class Course implements Serializable {
    @Id
    @Column(name = "COURSE_ID", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @XmlElement(name = "courseId")
    private Integer courseId;
    @Column(name = "COURSE_CODE", nullable = false)
    @XmlElement(name = "courseCode")
    private String courseCode;
    @Column(name = "COURSE_NAME", nullable = false)
    @XmlElement(name = "courseName")
    private String courseName;
    @Column(name = "PERIOD")
    @XmlElement(name = "period")
    private String period = "";
    @Column(name = "WEEK")
    @XmlElement(name = "weekNumber")
    private String weekNumber;
    @Column(name = "WEEK_DAY")
    @XmlElement(name = "weekDay")
    private String weekDay;
    @Column(name = "TIME_OF_DAY")
    @XmlElement(name = "timeOfDay")
    private String timeOfDay;
    @Column(name = "CLASSROOM")
    @XmlElement(name = "classroom")
    private String classroom = "";
    @Column(name = "TYPE")
    @XmlElement(name = "type")
    private String type;
    @Column(name = "DEPARTMENT")
    @XmlElement(name = "department")
    private String department;
    @Column(name = "TEACHER")
    @XmlElement(name = "teacher")
    private String teacher;
    @Column(name = "MISC")
    @XmlElement(name = "misc")
    private String misc;

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

    public String getTeacher() {
        return teacher;
    }

    public void setTeacher(String teacher) {
        this.teacher = teacher;
    }

    public String getMisc() {
        return misc;
    }

    public void setMisc(String misc) {
        this.misc = misc;
    }

    @Override
    public String toString() {
        return "[courseCode=" + courseCode + ", courseName=" + courseName + ", teacher=" + teacher +
                ", weekNumber=" + weekNumber + ", weekDay=" + weekDay + ", period=" + period + ", timeOfDay=" + timeOfDay +
                ", classroom=" + classroom + ", type=" + type + ", department=" + department + "]";
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 31)
                .append(courseCode)
                .append(courseName)
                .toHashCode();
    }
}
