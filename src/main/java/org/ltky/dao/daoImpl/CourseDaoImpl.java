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

    public Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    public void saveOrUpdate(Course course) {
        getCurrentSession().saveOrUpdate(course);
    }

    public void delete(Course course) {
        getCurrentSession().delete(course);
    }

    public List<Course> findByCourseCode(String courseCode) {
        //return getSession().find("from Course where COURSE_CODE=?", courseCode);
        final String hql = "from Course WHERE courseCode = :courseCode";
        Query query = getCurrentSession().createQuery(hql);
        List list = query.setParameter("courseCode", courseCode).list();
        return list;
    }

    public List<Course> findByDepartment(String department) {
        //return getSession().find("from Course where DEPARTMENT=?", department);
        final String hql = "FROM Course WHERE department = :department";
        Query query = getCurrentSession().createQuery(hql);
        List list = query.setParameter("department", department).list();
        return list;
    }

    public List<String> findCourseCodes(String courseCode) {
        final String hql = "SELECT C.courseCode FROM Course C WHERE C.courseCode like :courseCode";
        Query query = getCurrentSession().createQuery(hql);
        List list = query.setParameter("courseCode", courseCode + "%").list();
        return list;
    }
}
