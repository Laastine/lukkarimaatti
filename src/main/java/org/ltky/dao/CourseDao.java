package org.ltky.dao;

import org.ltky.dao.model.Course;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * CourseDao
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
@Component
public interface CourseDao extends CrudRepository<Course, Long>, QueryDslPredicateExecutor<Course> {
    @Query("SELECT c FROM Course c WHERE courseCode = :searchTerm")
    public List findByCourseCode(@Param("searchTerm") String searchTerm);

    @Query("SELECT DISTINCT(c.courseCode) FROM Course c WHERE courseCode like :searchTerm")
    public List<String> findDistinctCourseByCourseCodeLike(@Param("searchTerm") String searchTerm);

    @Query("SELECT c FROM Course c WHERE lower(c.courseName) = :searchTerm")
    public List<Course> findCourseByCourseNameIgnoreCase(@Param("searchTerm") String searchTerm);

    @Query("SELECT c.courseName FROM Course c WHERE lower(c.courseName) like %:searchTerm%")
    public List<Course> findCourseByCourseNameLikeIgnoreCase(@Param("searchTerm") String searchTerm);

    @Query("SELECT c FROM Course c WHERE LOWER(c.courseName) LIKE %:searchTerm%")
    public List<Course> findCourseByCourseNameAndCourseCodeLikeIgnoreCase(@Param("searchTerm") String searchTerm);

    @Query("SELECT c FROM Course c WHERE lower(c.department) = :searchTerm")
    public List<Course> findCourseByDepartmentIgnoreCase(@Param("searchTerm") String searchTerm);

    @Query("SELECT c.courseName FROM Course c")
    public List<String> findCourseByCourseName();
}