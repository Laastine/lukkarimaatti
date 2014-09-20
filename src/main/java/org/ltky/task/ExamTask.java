package org.ltky.task;

import org.apache.log4j.Logger;
import org.ltky.dao.ExamDao;
import org.ltky.parser.ExamHtmlParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 14.8.2014
 */
@Component
public class ExamTask {
    private static final Logger LOGGER = Logger.getLogger(ExamTask.class);
    @Autowired
    private ExamDao examDao;

    public void saveExamsToDB() {
        try {
            new ExamHtmlParser().parseExams().forEach(examDao::save);
        } catch (Exception e) {
            LOGGER.error("Exam parser error", e);
        }
    }
}
