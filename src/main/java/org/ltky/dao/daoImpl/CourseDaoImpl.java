package org.ltky.dao.daoImpl;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.ltky.dao.CourseDao;
import org.ltky.entity.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
@Repository
public class CourseDaoImpl implements CourseDao {
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

    public void saveOrUpdate(Course course) {
        getCurrentSession().saveOrUpdate(course);
    }

    public void delete() {
        final String hql = "DELETE FROM Course";
        Query query = getCurrentSession().createQuery(hql);
        query.executeUpdate();
    }

    public List<Course> findByCourseCode(String courseCode) {
        final String hql = "FROM Course WHERE courseCode = :courseCode";
        Query query = getCurrentSession().createQuery(hql);
        List<Course> list = query.setParameter("courseCode", courseCode).list();
        return list;
    }

    public List<String> findCourseCodes(String courseCode) {
        final String hql = "SELECT C.courseCode FROM Course C WHERE C.courseCode like :courseCode";
        Query query = getCurrentSession().createQuery(hql);
        List<String> list = query.setParameter("courseCode", courseCode + "%").list();
        return list;
    }

    public List<Course> findByCourseName(String courseName) {
        final String hql = "FROM Course WHERE courseName = :courseName";
        Query query = getCurrentSession().createQuery(hql);
        List<Course> list = query.setParameter("courseName", courseName).list();
        return list;
    }

    public List<Course> findCourseNames(String courseName) {
        final String hql = "FROM Course C WHERE lower(C.courseName) like lower(:courseName)";
        Query query = getCurrentSession().createQuery(hql);
        List<Course> list = query.setParameter("courseName", courseName + "%").list();
        return list;
    }

    public List<Course> findByDepartment(String department) {
        final String hql = "FROM Course WHERE department = :department";
        Query query = getCurrentSession().createQuery(hql);
        List<Course> list = query.setParameter("department", department).list();
        return list;
    }

    public List<String> findAllCourseNames() {
        final String hql = "SELECT C.courseName FROM Course C";
        Query query = getCurrentSession().createQuery(hql);
        List<String> list = query.list();
        return list;
    }

}
