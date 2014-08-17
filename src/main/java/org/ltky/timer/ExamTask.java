package org.ltky.timer;

import org.apache.log4j.Logger;
import org.ltky.dao.ExamDao;
import org.ltky.parser.ExamParser;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 14.8.2014
 */
public class ExamTask {

    private static final Logger LOGGER = Logger.getLogger(ExamTask.class);

    @Autowired(required = true)
    private ExamDao examDao;

    public ExamTask() {
    }

    public void saveExamsToDB() {
        try {
            examDao.delete();
            new ExamParser().parseExams().forEach(examDao::saveOrUpdate);
        } catch (Exception e) {
            LOGGER.error("Exam parser error", e);
        }
    }
}
