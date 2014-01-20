package org.ltky.parser;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.entity.Course;
import org.ltky.validator.CourseValidator;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 8.12.2013
 */
public class ParserTask implements Runnable {

    private final String department;
    private final String departmentData;
    private static final Logger logger = Logger.getLogger(ParserTask.class);
    private final ApplicationContext applicationContext = new ClassPathXmlApplicationContext("hibernate/hibernateConfig.xml");
    private final CourseDao courseDao = (CourseDao) applicationContext.getBean("courseDao");

    public ParserTask(String department, String departmentData){
        this.department = department;
        this.departmentData = departmentData;
    }

    @Override
    public void run() {
        logger.info(Thread.currentThread().getName() + " Start, cmd=" + department);
        processCommand();
    }

    /**
     * Save course data to DB
     */
    private void processCommand() {
        try {
            final HtmlParser htmlParser = new HtmlParser(departmentData, department);
            logger.debug("getResultList="+htmlParser.formatEachEducationEvent(htmlParser.getResultList()).size());
            courseDao.delete();          //clean old courses
            for (Course newCourse : htmlParser.formatEachEducationEvent(htmlParser.getResultList())) {
                if(CourseValidator.validateCourse(newCourse)) {
                    courseDao.saveOrUpdate(newCourse);
                }
            }
        } catch (Exception e) {
            logger.error("HtmlParser error", e);
        }
    }

    @Override
    public String toString(){
        return this.department;
    }
}
