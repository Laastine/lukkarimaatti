package org.ltky.controller;

import org.apache.log4j.Logger;
import org.ltky.dao.ExamDao;
import org.ltky.model.Exam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
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
@RequestMapping("/exam")
public class ExamController {
    private static final Logger LOGGER = Logger.getLogger(ExamController.class);
    private static final int MIN = 3;

    @Autowired
    private ExamDao examDao;

    public ExamController() {}

    @RequestMapping(value = "/examname/{examName}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Exam> getExamName(@PathVariable String examName) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getExamNames");
        return examDao.findByExamName(examName);
    }

    @RequestMapping(value = "/examnames/{examNames}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Exam> getExamNames(@PathVariable final String examNames) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getExamNames");
        if (examNames.length() > MIN) {
            return examDao.findExamNames(examNames);
        } else {
            return new ArrayList<>();
        }
    }
}
