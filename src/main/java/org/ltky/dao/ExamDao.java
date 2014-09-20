package org.ltky.dao;

import org.ltky.dao.model.Exam;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 20.4.2014
 */
@Component
public interface ExamDao extends CrudRepository<Exam, Long>, QueryDslPredicateExecutor<Exam> {

    @Query("SELECT E.courseName, E.courseCode, E.examTimes FROM Exam E WHERE lower(E.courseName) = lower(:courseName)")
    List<Exam> findByExamName(@Param("courseName") String courseName);

    @Query("SELECT E.courseName, E.courseCode, E.examTimes FROM Exam E WHERE lower(E.courseName) like lower(:courseName)")
    List<Exam> findExamNames(@Param("courseName") String courseName);
}
