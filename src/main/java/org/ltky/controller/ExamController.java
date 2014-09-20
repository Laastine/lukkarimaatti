package org.ltky.controller;

import org.apache.log4j.Logger;
import org.ltky.dao.ExamDao;
import org.ltky.dao.model.Exam;
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
@RequestMapping("/exam")
public class ExamController {
    private static final int MIN = 3;
    @Autowired
    private ExamDao examDao;

    @RequestMapping(value = "/examname/{examName}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Exam> getExamName(@PathVariable String examName) {
        return examDao.findByExamName(examName);
    }

    @RequestMapping(value = "/examnames/{examNames}", method = RequestMethod.GET)
    public
    @ResponseBody
    final List<Exam> getExamNames(@PathVariable final String examNames) {
        if (examNames.length() > MIN) {
            return examDao.findExamNames(examNames);
        } else {
            return new ArrayList<>();
        }
    }
}
