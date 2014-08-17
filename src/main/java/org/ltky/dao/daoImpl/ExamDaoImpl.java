package org.ltky.dao.daoimpl;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.ltky.dao.ExamDao;
import org.ltky.model.Exam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 20.4.2014
 */
@Repository
public class ExamDaoImpl implements ExamDao {
    @Autowired
    private SessionFactory sessionFactory;

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    public void saveOrUpdate(Exam exam) {
        getCurrentSession().saveOrUpdate(exam);
    }

    public void delete() {
        final String hql = "DELETE FROM Exam";
        Query query = getCurrentSession().createQuery(hql);
        query.executeUpdate();
    }

    public List<Exam> findByExamName(String courseName) {
        final String hql = "SELECT E.courseName, E.courseCode, E.examTimes FROM Exam E WHERE lower(E.courseName) = lower(:courseName)";
        Query query = getCurrentSession().createQuery(hql);
        return query.setParameter("courseName", courseName).list();
    }

    public List<Exam> findExamNames(String courseName) {
        final String hql = "SELECT E.courseName, E.courseCode, E.examTimes FROM Exam E WHERE lower(E.courseName) like lower(:courseName)";
        Query query = getCurrentSession().createQuery(hql);
        return query.setParameter("courseName", "%" + courseName + "%").list();
    }
}
