package org.ltky.web.rest;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.dao.ExamDao;
import org.ltky.entity.Course;
import org.ltky.entity.Exam;
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
    private final ExamDao examDao = (ExamDao) applicationContext.getBean("examDao");
    private static final int MIN = 3;
    private static final StringHelper STRING_HELPER = new StringHelper();

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/code/{code}")
    public final List<Course> getCourseCode(@PathParam("code") final String code) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseCode");
        return courseDao.findByCourseCode(code);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/codes/{codes}")
    public final List<String> getLikeCourseCodes(@PathParam("codes") final String codes) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getLikeCourseCodes");
        return STRING_HELPER.removeDuplicates(courseDao.findCourseCodes(codes));
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/name/{courseName}")
    public final List<Course> getCourseName(@PathParam("courseName") final String courseName) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseName");
        return courseDao.findByCourseName(courseName);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/names/{courseNames}")
    public final List<Course> getCourseNames(@PathParam("courseNames") final String courseNames) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseNames");
        if (courseNames.length() > MIN) {
            return courseDao.findCourseNames(courseNames);
        } else {
            return new ArrayList<>();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/cnames/{courseNamesandCodes}")
    public final List<Course> getCourseNamesWithCode(@PathParam("courseNamesandCodes") final String courseNamesandCodes) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseNamesWithCode");
        if (courseNamesandCodes.length() > MIN) {
            return courseDao.findCourseNamesAndCodes(courseNamesandCodes);
        } else {
            return new ArrayList<>();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/department/{department}")
    public final List<Course> getDepartmentInJSON(@PathParam("department") final String department) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getDepartmentInJSON");
        return courseDao.findByDepartment(department);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/all/")
    public final List<String> getAllCourseCodes() {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getAllCourseCodes");
        return courseDao.findAllCourseNames();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/examname/{examName}")
    public final List<Exam> getExamName(@PathParam("examName") final String examName) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getExamNames");
        return examDao.findByExamName(examName);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Path("/examnames/{examNames}")
    public final List<Exam> getExamNames(@PathParam("examNames") final String examNames) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getExamNames");
        if (examNames.length() > MIN) {
            return examDao.findExamNames(examNames);
        } else {
            return new ArrayList<>();
        }
    }

}
