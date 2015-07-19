package org.ltky.controller;

import org.ltky.dao.CourseDao;
import org.ltky.dao.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
        return courseDao.findDistinctCourseByCourseCodeLike(codes);
    }

    @RequestMapping(value = "/name/{courseName}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourseName(@PathVariable String courseName) {
        return courseDao.findCourseByCourseNameIgnoreCase(courseName.toLowerCase());
    }

    @RequestMapping(value = "/names/{courseNames}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourseNames(@PathVariable String courseNames) {
        if (courseNames.length() >= MIN) {
            return courseDao.findCourseByCourseNameLikeIgnoreCase(courseNames.toLowerCase());
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/cnames/{courseNamesandCodes}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourseNamesWithCode(@PathVariable String courseNamesandCodes) {
        if (courseNamesandCodes.length() >= MIN) {
            return courseDao.findCourseByCourseNameAndCourseCodeLikeIgnoreCase(courseNamesandCodes.toLowerCase());
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/codeAndGroup", params = {"code", "groupName"}, method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourseWithCodeAndGroup(@RequestParam(value = "code") String code,
                                                 @RequestParam(value = "groupName") String groupName) {
        if (code.length() >= MIN && groupName.length() > 0) {
            return courseDao.findCourseByCourseCodeAndGroup(code.toUpperCase(), groupName.toUpperCase());
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/course", params = {"name"}, method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getCourse(@RequestParam(value = "name") String name) {
        if (name.length() >= MIN) {
            return courseDao.findCourseByCourseNameAndCourseCodeLikeIgnoreCase(name.toLowerCase());
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping(value = "/department/{department}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Course> getDepartmentInJSON(@PathVariable String department) {
        return courseDao.findCourseByDepartmentIgnoreCase(department);
    }

    @RequestMapping(value = "/all/")
    public
    @ResponseBody
    final List<String> getAllCourseCodes() {
        return courseDao.findCourseByCourseName();
    }
}
