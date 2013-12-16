package org.ltky.dao.daoImpl;

import org.ltky.dao.CourseDao;
import org.ltky.model.Course;
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

    public Course findByCourseCode(String courseCode) {
        List list = getHibernateTemplate().find("from Course where COURSE_CODE=?", courseCode);
        return (Course) list.get(0);
    }

    public Course findByCourseName(String courseName) {
        List list = getHibernateTemplate().find("from Course where COURSE_NAME=?", courseName);
        return (Course) list.get(0);
    }

    public List<Course> findByDepartment(String department) {
        List<Course> list = getHibernateTemplate().find("from Course where DEPARTMENT=?", department);
        return list;
    }
}
