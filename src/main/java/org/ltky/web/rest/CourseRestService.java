package org.ltky.web.rest;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.model.Course;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 14.12.2013
 */
@Path("/")
public class CourseRestService {
    private static final Logger logger = Logger.getLogger(CourseRestService.class);
    private final ApplicationContext applicationContext = new ClassPathXmlApplicationContext("config/BeanLocations.xml");
    private final CourseDao courseDao = (CourseDao) applicationContext.getBean("courseDao");

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/code/{code}")
    public List<Course> getCodeInJSON(@PathParam("code") String code) {
        logger.debug("getCodeInJSON");
        List<Course> courseList = courseDao.findByCourseCode(code);
        return courseList;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/name/{courseName}")
    public List<Course> getNameInJSON(@PathParam("courseName") String courseName) {
        logger.debug("getNameInJSON");
        List<Course> courseList = courseDao.findByCourseName(courseName);
        return courseList;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/department/{department}")
    public List<Course> getDepartmentInJSON(@PathParam("department") String department) {
        logger.debug("getDepartmentInJSON");
        List<Course> departmentCourseList = courseDao.findByDepartment(department);
        return departmentCourseList;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/codes/{codes}")
    public List<String> getCourseCodes(@PathParam("codes") String codes) {
        logger.debug("getCourseCodes");
        List<String> codeList = courseDao.findByCourseCodes(codes);
        return codeList;
    }

}
