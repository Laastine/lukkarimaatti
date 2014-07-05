package org.ltky.dao.daoimpl;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.ltky.dao.CourseDao;
import org.ltky.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
@Repository
@Service
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
        getCurrentSession().createQuery("DELETE FROM Course").executeUpdate();
    }

    public List<Course> findByCourseCode(String courseCode) {
        final Query query = getCurrentSession().createQuery("FROM Course WHERE courseCode = :courseCode");
        return query.setParameter("courseCode", courseCode).list();
    }

    public List<String> findCourseCodes(String courseCode) {
        final Query query = getCurrentSession().createQuery("SELECT C.courseCode FROM Course C WHERE C.courseCode like :courseCode");
        return query.setParameter("courseCode", courseCode + "%").list();
    }

    public List<Course> findByCourseName(String courseName) {
        final Query query = getCurrentSession().createQuery("FROM Course WHERE courseName = :courseName");
        return query.setParameter("courseName", courseName).list();
    }

    public List<Course> findCourseNames(String courseName) {
        final Query query = getCurrentSession().createQuery("SELECT C.courseName FROM Course C WHERE lower(C.courseName) like lower(:courseName)");
        return query.setParameter("courseName", "%" + courseName + "%").list();
    }

    public List<Course> findCourseNamesAndCodes(String courseName) {
        final Query query = getCurrentSession().createQuery("FROM Course C WHERE lower(C.courseName) like lower(:courseName)");
        return query.setParameter("courseName", "%" + courseName + "%").list();
    }

    public List<Course> findByDepartment(String department) {
        final Query query = getCurrentSession().createQuery("FROM Course WHERE department = :department");
        return query.setParameter("department", department).list();
    }

    public List<String> findAllCourseNames() {
        return getCurrentSession().createQuery("SELECT C.courseName FROM Course C").list();
    }

}
