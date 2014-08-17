package org.ltky.task;

import org.apache.log4j.Logger;
import org.ltky.dao.CourseDao;
import org.ltky.dao.ExamDao;
import org.ltky.parser.URLParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

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
    private ExamTask examTask;
    @Autowired
    private CourseDao courseDao;
    @Autowired
    private ExamDao examDao;

    public TaskConfigurer() {
    }

    private void getLinks() {
        try {
            map = new URLParser().fetchStuff();
        } catch (IOException e) {
            LOGGER.error("Malformed UNI URL", e);
        }
    }

    public void setUpRunners() {
        getLinks();
        courseDao.delete();      //clean old courses
        ExecutorService executor = Executors.newFixedThreadPool(map.size());
        for (Map.Entry<String, String> entry : map.entrySet()) {
            executor.execute(() -> courseTask.parse(entry.getKey(), entry.getValue()));
        }
        executor.shutdown();
        while (!executor.isTerminated()) {
        }
    }

    @Scheduled(cron = "0 0 6 * * *")
    public void updateCourseDataCronJob() {
        LOGGER.info("course data update cron task");
        setUpRunners();
    }

    @Scheduled(cron = "0 0 5 * * *")
    public void updateExamDataCronJob() {
        LOGGER.info("exam data update cron task");
        examDao.delete();
        examTask.saveExamsToDB();
    }
}
