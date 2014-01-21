package org.ltky.web.rest;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.entity.Course;
import org.ltky.util.StringHelper;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 14.12.2013
 */
@Path("/")
public class CourseRestService {
    private static final Logger LOGGER = Logger.getLogger(CourseRestService.class);
    private final ApplicationContext applicationContext = new ClassPathXmlApplicationContext("hibernate/hibernateConfig.xml");
    private final CourseDao courseDao = (CourseDao) applicationContext.getBean("courseDao");
    private static final int MIN = 3;

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/code/{code}")
    public List<Course> getCourseCode(@PathParam("code") String code) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseCode");
        List<Course> courseList = courseDao.findByCourseCode(code);
        return courseList;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/codes/{codes}")
    public List<String> getLikeCourseCodes(@PathParam("codes") String codes) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getLikeCourseCodes");
        List<String> courseCodesList = new StringHelper().removeDuplicates(courseDao.findCourseCodes(codes));
        return courseCodesList;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/name/{courseName}")
    public List<Course> getCourseName(@PathParam("courseName") String courseName) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseName");
        List<Course> courseList = courseDao.findByCourseName(courseName);
        return courseList;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/names/{courseNames}")
    public List<Course> getCourseNames(@PathParam("courseNames") String courseNames) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseNames");
        if (courseNames.length() > MIN) {
            List<Course> courseList = courseDao.findCourseNames(courseNames);
            return courseList;
        } else {
            List<Course> courseList = new ArrayList<>();
            return courseList;
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/department/{department}")
    public List<Course> getDepartmentInJSON(@PathParam("department") String department) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getDepartmentInJSON");
        List<Course> departmentCourseList = courseDao.findByDepartment(department);
        return departmentCourseList;
    }
}
