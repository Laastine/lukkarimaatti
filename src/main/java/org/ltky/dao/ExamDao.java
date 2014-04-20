package org.ltky.dao;

import org.ltky.entity.Exam;

import javax.transaction.Transactional;
import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 20.4.2014
 */
@Transactional
public interface ExamDao {
    void saveOrUpdate(Exam exam);

    void delete();

    List<Exam> findByExamName(String courseName);

    List<Exam> findExamNames(String courseName);

}