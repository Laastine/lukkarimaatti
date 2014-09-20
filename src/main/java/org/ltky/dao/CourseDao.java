package org.ltky.dao;

import org.ltky.dao.model.Course;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
@Component
public interface CourseDao extends CrudRepository<Course, Long>, QueryDslPredicateExecutor<Course> {
    @Query("SELECT c FROM Course c WHERE courseCode = :courseCode")
    public List findByCourseCode(@Param("courseCode") String courseCode);

    @Query("SELECT c.courseCode FROM Course c WHERE c.courseCode like :courseCode")
    public List<String> findCourseCodes(String code);

    @Query("SELECT c FROM Course c WHERE c.courseName = :courseName")
    public List<Course> findByCourseName(@Param("courseName") String courseName);

    @Query("SELECT c.courseName FROM Course c WHERE lower(c.courseName) like lower(:courseName)")
    public List<Course> findCourseNames(@Param("courseName") String courseName);

    @Query("SELECT c FROM Course c WHERE LOWER(c.courseName) LIKE %:courseName% ")
    public List<Course> findCourseNamesAndCodes(@Param("courseName") String courseName);

    @Query("SELECT c FROM Course c WHERE department = :department")
    public List<Course> findByDepartment(@Param("department") String department);

    @Query("SELECT c.courseName FROM Course c")
    public List<String> findAllCourseNames();
}