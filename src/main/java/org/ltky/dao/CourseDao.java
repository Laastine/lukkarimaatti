package org.ltky.dao;

import org.ltky.model.Course;

import java.util.List;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
public interface CourseDao {
    void save(Course course);

    void saveOrUpdate(Course course);

    void update(Course course);

    void delete(Course course);

    Course findByCourseCode(String courseCode);

    Course findByCourseName(String courseName);

    List<Course> findByDepartment(String department);
}
