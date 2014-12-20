package org.ltky.task;

import org.ltky.dao.CourseDao;
import org.ltky.parser.URLParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.IOException;
import java.util.Map;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 26.11.2013
 */
@Configuration
@EnableScheduling
public class TaskConfigurer {
    private static final Logger LOGGER = LoggerFactory.getLogger(TaskConfigurer.class);
    private Map<String, String> map;
    @Autowired
    private CourseTask courseTask;
    @Autowired
    private CourseDao courseDao;

    private void getLinks() {
        try {
            map = new URLParser().fetchStuff();
        } catch (IOException e) {
            LOGGER.error("Malformed UNI URL", e);
        }
    }

    public void setUpRunners() {
        getLinks();
        courseDao.deleteAll();      //clean old courses
        for (Map.Entry<String, String> entry : map.entrySet()) {
            ((Runnable) () -> courseTask.parse(entry.getKey(), entry.getValue())).run();
        }
    }

    @Scheduled(cron = "0 0 4 * * *")
    public void updateCourseDataCronJob() {
        LOGGER.info("course data update cron task");
        setUpRunners();
    }
}
