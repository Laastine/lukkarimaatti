package org.ltky.dao.daoImpl;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.ltky.dao.CourseDao;
import org.ltky.model.Course;
import org.ltky.util.StringHelper;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import java.util.List;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
public class CourseDaoImpl extends HibernateDaoSupport implements CourseDao {
    public void save(Course course) {
        getHibernateTemplate().save(course);
    }

    public void saveOrUpdate(Course course) {
        getHibernateTemplate().saveOrUpdate(course);
    }

    public void update(Course course) {
        getHibernateTemplate().update(course);
    }

    public void delete(Course course) {
        getHibernateTemplate().delete(course);
    }

    public List<Course> findByCourseCode(String courseCode) {
        return getHibernateTemplate().find("from Course where COURSE_CODE=?", courseCode);
    }

    public List<Course> findByCourseName(String courseName) {
        return getHibernateTemplate().find("from Course where COURSE_NAME=?", courseName);
    }

    public List<Course> findByDepartment(String department) {
        return getHibernateTemplate().find("from Course where DEPARTMENT=?", department);
    }

    public List<String> findCourseCodes(String courseCode) {
        final String hql = "SELECT C.courseCode FROM Course C WHERE C.courseCode like :courseCode";
        Query query = getSession().createQuery(hql);
        List list = query.setParameter("courseCode", courseCode+"%").list();
        return list;
    }
}
