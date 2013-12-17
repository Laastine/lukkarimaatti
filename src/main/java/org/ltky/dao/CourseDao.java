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

    List<Course> findByCourseCode(String courseCode);

    List<Course> findByCourseName(String courseName);

    List<Course> findByDepartment(String department);

    List<String> findByCourseCodes(String code);
}
