package org.ltky.controller;

import org.ltky.dao.CourseDao;
import org.ltky.dao.ExamDao;
import org.ltky.entity.Course;
import org.ltky.entity.Exam;
import org.ltky.util.Util;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.apache.log4j.Logger;

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
public class RestController {
    private static final Logger LOGGER = Logger.getLogger(RestController.class);
    private final ApplicationContext applicationContext = new ClassPathXmlApplicationContext("hibernate/hibernateConfig.xml");
    private final CourseDao courseDao = (CourseDao) applicationContext.getBean("courseDao");
    private final ExamDao examDao = (ExamDao) applicationContext.getBean("examDao");
    private static final int MIN = 3;
    private static final Util UTIL = new Util();

    @RequestMapping(value = "/code/{code}", method = RequestMethod.GET)
    public @ResponseBody final List<Course> getCourseCode(@PathVariable String code) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseCode");
        return courseDao.findByCourseCode(code);
    }

    @RequestMapping(value = "/codes/{codes}", method = RequestMethod.GET)
    public @ResponseBody final List<String> getLikeCourseCodes(@PathVariable String codes) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getLikeCourseCodes");
        return UTIL.removeDuplicates(courseDao.findCourseCodes(codes));
    }

    @RequestMapping(value = "/name/{courseName}", method = RequestMethod.GET)
    public @ResponseBody final List<Course> getCourseName(@PathVariable String courseName) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseName");
        return courseDao.findByCourseName(courseName);
    }

    @RequestMapping(value = "/names/{courseNames}", method = RequestMethod.GET)
    public @ResponseBody List<Course> getCourseNames(@PathVariable String courseNames) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseNames");
        if (courseNames.length() > MIN) {
            return courseDao.findCourseNames(courseNames);
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/cnames/{courseNamesandCodes}", method = RequestMethod.GET)
    public @ResponseBody final List<Course> getCourseNamesWithCode(@PathVariable String courseNamesandCodes) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getCourseNamesWithCode");
        if (courseNamesandCodes.length() > MIN) {
            return courseDao.findCourseNamesAndCodes(courseNamesandCodes);
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/department/{department}", method = RequestMethod.GET)
    public @ResponseBody final List<Course> getDepartmentInJSON(@PathVariable String department) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getDepartmentInJSON");
        return courseDao.findByDepartment(department);
    }

    @RequestMapping(value = "/all/")
    public @ResponseBody final List<String> getAllCourseCodes() {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getAllCourseCodes");
        return courseDao.findAllCourseNames();
    }

    @RequestMapping(value = "/examname/{examName}", method = RequestMethod.GET)
    public @ResponseBody final List<Exam> getExamName(@PathVariable String examName) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getExamNames");
        return examDao.findByExamName(examName);
    }

    @RequestMapping(value = "/examnames/{examNames}", method = RequestMethod.GET)
    public @ResponseBody final List<Exam> getExamNames(@PathVariable final String examNames) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getExamNames");
        if (examNames.length() > MIN) {
            return examDao.findExamNames(examNames);
        } else {
            return new ArrayList<>();
        }
    }
}
