package org.ltky.task;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.parser.URLParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Map;

/**
 * TaskConfigurer
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 26.11.2013
 */
@Configuration
@EnableScheduling
public class TaskConfigurer {
    private static final Logger LOGGER = Logger.getLogger(TaskConfigurer.class);
    private Map<String, String> map;
    @Autowired
    private CourseTask courseTask;
    @Autowired
    private CourseDao courseDao;

    private void getLinks() throws Exception {
        map = new URLParser().parseLinks();
    }

    private void setUpRunners() throws Exception {
        getLinks();
        LOGGER.info("Deleting old data");
        courseDao.deleteAll();      //clean old courses
        for (Map.Entry<String, String> entry : map.entrySet()) {
            ((Runnable) () -> courseTask.parse(entry.getKey(), entry.getValue())).run();
        }
    }

    @Scheduled(cron = "0 0 4 * * *")
    public void updateCourseDataCronJob() {
        LOGGER.info("Course data update cron task");
        try {
            setUpRunners();
        } catch (Exception e) {
            LOGGER.error("Error while updating DB ", e);
        }
    }

    public void updateCourseDataManually() {
        LOGGER.info("Course data update manually task");
        try {
            setUpRunners();
        } catch (Exception e) {
            LOGGER.error("Error while updating DB ", e);
        }
    }
}
