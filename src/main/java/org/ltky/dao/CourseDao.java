package org.ltky.dao;

import org.ltky.entity.Course;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */

@Transactional
public interface CourseDao {
    void saveOrUpdate(Course course);

    void delete(Course course);

    List<Course> findByCourseCode(String courseCode);

    List<Course> findByDepartment(String department);

    List<String> findCourseCodes(String code);
}
