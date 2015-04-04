package org.ltky.dao.model;

import org.apache.commons.lang3.builder.HashCodeBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.UUID;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
@Entity
@Table(name = "COURSE")
public class Course implements Serializable {
    @Id
    @Column(name = "COURSE_ID")
    public Long courseId;
    @Column(name = "COURSE_CODE")
    public String courseCode;
    @Column(name = "COURSE_NAME")
    public String courseName;
    @Column(name = "PERIOD")
    public String period = "";
    @Column(name = "WEEK")
    public String weekNumber;
    @Column(name = "WEEK_DAY")
    public String weekDay;
    @Column(name = "TIME_OF_DAY")
    public String timeOfDay;
    @Column(name = "CLASSROOM")
    public String classroom;
    @Column(name = "TYPE")
    public String type;
    @Column(name = "DEPARTMENT")
    public String department;
    @Column(name = "TEACHER")
    public String teacher;
    @Column(name = "MISC")
    public String misc;
    @Column(name = "GROUP_NAME")
    public String groupName;

    public Course(String courseCode, String courseName,
                  String weekNumber, String weekDay,
                  String timeOfDay, String classroom,
                  String type, String department,
                  String teacher, String misc, String groupName) {
        this.courseId = UUID.randomUUID().getLeastSignificantBits();
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.weekNumber = weekNumber;
        this.weekDay = weekDay;
        this.timeOfDay = timeOfDay;
        this.classroom = classroom;
        this.type = type;
        this.department = department;
        this.teacher = teacher;
        this.misc = misc;
        this.groupName = groupName;
    }

    //For Hibernate mutation
    public Course() {
    }

    @Override
    public String toString() {
        return "[courseCode=" + courseCode + ", courseName=" + courseName + ", teacher=" + teacher +
                ", weekNumber=" + weekNumber + ", weekDay=" + weekDay + ", period=" + period + ", timeOfDay=" + timeOfDay +
                ", classroom=" + classroom + ", type=" + type + ", department=" + department + ", groupName=" + groupName +"]";
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 31)
                .append(courseCode)
                .append(courseName)
                .toHashCode();
    }
}
