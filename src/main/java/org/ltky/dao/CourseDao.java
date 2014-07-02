package org.ltky.dao;

import org.ltky.model.Course;
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

    void delete();

    List findByCourseCode(String courseCode);

    List<String> findCourseCodes(String code);

    List<Course> findByCourseName(String courseName);

    List<Course> findCourseNames(String courseName);

    List<Course> findCourseNamesAndCodes(String courseName);

    List<Course> findByDepartment(String department);

    List<String> findAllCourseNames();

}
