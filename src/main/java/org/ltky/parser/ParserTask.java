package org.ltky.parser;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.dao.ExamDao;
import org.ltky.validator.CourseValidator;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 8.12.2013
 */
public class ParserTask implements Runnable {
    private final String department;
    private final String departmentData;
    private static final Logger LOGGER = Logger.getLogger(ParserTask.class);
    private final ApplicationContext applicationContext = new ClassPathXmlApplicationContext("hibernate/hibernateConfig.xml");

    public ParserTask(String department, String departmentData) {
        this.department = department;
        this.departmentData = departmentData;
    }

    @Override
    public void run() {
        LOGGER.info(Thread.currentThread().getName() + " Start, cmd=" + department);
        saveCourseToDB();
    }

    /**
     * Save course data to DB
     */
    private void saveCourseToDB() {
        final CourseDao courseDao = (CourseDao) applicationContext.getBean("courseDao");
        try {
            courseDao.delete();     //clean old courses
            (new HtmlParser(department).parse(departmentData)).stream().filter(newCourse -> CourseValidator.validateCourse(newCourse)).forEach(courseDao::saveOrUpdate);
        } catch (Exception e) {
            LOGGER.error("HtmlParser error", e);
        }
    }

    public void saveExamsToDB() {
        final ExamDao examDao = (ExamDao) applicationContext.getBean("examDao");
        try {
            examDao.delete();
            new ExamParser().parseExams().forEach(examDao::saveOrUpdate);
        } catch (Exception e) {
            LOGGER.error("Exam parser error", e);
        }
    }

    @Override
    public String toString() {
        return this.department;
    }
}
