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

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 14.12.2013
 */
@Path("/code")
public class CourseRestService {
    private static final Logger logger = Logger.getLogger(CourseRestService.class);
    private final ApplicationContext applicationContext = new ClassPathXmlApplicationContext("config/BeanLocations.xml");
    private final CourseDao courseDao = (CourseDao) applicationContext.getBean("courseDao");

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{code}")
    public Course getCodeInJSON(@PathParam("code") String code) {
        logger.debug("getCodeInJSON");
        Course course = courseDao.findByCourseCode(code);
        logger.debug(course);
        return course;
    }
/*
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{courseName}")
    public Course getNameInJSON(@PathParam("courseName") String courseName) {
        logger.debug("getNameInJSON");
        Course course = courseDao.findByCourseName(courseName);
        logger.debug(course);
        return course;
    }
*/
}
