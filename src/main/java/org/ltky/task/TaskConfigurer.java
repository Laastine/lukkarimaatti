package org.ltky.task;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.parser.URLParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.Map;
import java.util.Properties;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 26.11.2013
 */
@Configuration
@EnableScheduling
public class TaskConfigurer {
    private static final Logger LOGGER = Logger.getLogger(TaskConfigurer.class);
    @Resource
    Properties lukkariProperties;
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
