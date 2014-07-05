package org.ltky.controller;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.model.Course;
import org.ltky.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 2.7.2014
 */
@Controller
@RequestMapping("/rest")
public class CourseController {
    private static final Logger LOGGER = Logger.getLogger(CourseController.class);
    private static final int MIN = 3;
    private static final Util UTIL = new Util();

    @Autowired
    private CourseDao courseDao;

    public CourseController() {}

    @RequestMapping(value = "/code/{code}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourseCode(@PathVariable String code) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseCode");
        return courseDao.findByCourseCode(code);
    }

    @RequestMapping(value = "/codes/{codes}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<String> getLikeCourseCodes(@PathVariable String codes) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getLikeCourseCodes");
        return UTIL.removeDuplicates(courseDao.findCourseCodes(codes));
    }

    @RequestMapping(value = "/name/{courseName}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourseName(@PathVariable String courseName) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseName");
        return courseDao.findByCourseName(courseName);
    }

    @RequestMapping(value = "/names/{courseNames}", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Course> getCourseNames(@PathVariable String courseNames) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseNames");
        if (courseNames.length() > MIN) {
            return courseDao.findCourseNames(courseNames);
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/cnames/{courseNamesandCodes}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourseNamesWithCode(@PathVariable String courseNamesandCodes) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseNamesWithCode");
        if (courseNamesandCodes.length() > MIN) {
            return courseDao.findCourseNamesAndCodes(courseNamesandCodes);
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/department/{department}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getDepartmentInJSON(@PathVariable String department) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getDepartmentInJSON");
        return courseDao.findByDepartment(department);
    }

    @RequestMapping(value = "/all/")
    public
    @ResponseBody
    final List<String> getAllCourseCodes() {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getAllCourseCodes");
        return courseDao.findAllCourseNames();
    }
}
