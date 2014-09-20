package org.ltky.controller;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.dao.model.Course;
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
    private static final int MIN = 2;
    private final Util UTIL = Util.getInstance();
    private static final Logger LOGGER = Logger.getLogger(CourseController.class);
    @Autowired
    private CourseDao courseDao;

    @RequestMapping(value = "/code/{code}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourseCode(@PathVariable String code) {
        return courseDao.findByCourseCode(code);
    }

    @RequestMapping(value = "/codes/{codes}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<String> getLikeCourseCodes(@PathVariable String codes) {
        return UTIL.removeDuplicates(courseDao.findCourseCodes(codes));
    }

    @RequestMapping(value = "/name/{courseName}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourseName(@PathVariable String courseName) {
        return courseDao.findByCourseName(courseName);
    }

    @RequestMapping(value = "/names/{courseNames}", method = RequestMethod.GET)
    public
    @ResponseBody
    List<Course> getCourseNames(@PathVariable String courseNames) {
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
        if (courseNamesandCodes.length() >= MIN) {
            LOGGER.info("RESULTS"+courseDao.findCourseNamesAndCodes(courseNamesandCodes.toLowerCase()));
            return courseDao.findCourseNamesAndCodes(courseNamesandCodes.toLowerCase());
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/department/{department}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getDepartmentInJSON(@PathVariable String department) {
        return courseDao.findByDepartment(department);
    }

    @RequestMapping(value = "/all/")
    public
    @ResponseBody
    final List<String> getAllCourseCodes() {
        return courseDao.findAllCourseNames();
    }
}
