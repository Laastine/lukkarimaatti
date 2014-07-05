package org.ltky.model;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.Immutable;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 20.4.2014
 */
@XmlRootElement
@Entity
@Immutable
@Table(name = "EXAM")
public class Exam {
    @Id
    @Column(name = "EXAM_ID", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @XmlElement(name = "examId")
    private Integer examId;

    @Column(name = "COURSE_CODE", nullable = false)
    @XmlElement(name = "courseCode")
    private String courseCode;

    @Column(name = "COURSE_NAME", nullable = false)
    @XmlElement(name = "courseName")
    private String courseName;

    @Column(name = "EXAM_TIMES")
    @XmlElement(name = "examTimes")
    private String examTimes;

    public Integer getExamId() {
        return examId;
    }

    public void setExamId(Integer examId) {
        this.examId = examId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getExamTimes() {
        return examTimes;
    }

    public void setExamTimes(String examTimes) {
        this.examTimes = examTimes;
    }

    @Override
    public String toString() {
        return "[courseCode=" + courseCode + ", courseName=" + courseName + ", examTimes=" + examTimes;
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 53)
                .append(courseCode)
                .append(courseName)
                .append(examTimes)
                .toHashCode();
    }
}
