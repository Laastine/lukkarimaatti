package org.ltky.timer;

import org.apache.log4j.Logger;
import org.ltky.parser.URLParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.Iterator;
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
@Component
@EnableScheduling
public class FetchJob {
    private static final Logger LOGGER = Logger.getLogger(FetchJob.class);
    private Map<String, String> map;
    @Resource
    Properties lukkariProperties;

    @Autowired
    private CourseTask courseTask;

    private void getLinks() {
        try {
            map = new URLParser().fetchStuff();
        } catch (IOException e) {
            LOGGER.error("Malformed UNI URL", e);
        }
    }

    //TODO: Fix calling method
    public void fetchDepartmentData() {
        getLinks();
        Iterator iterator = map.entrySet().iterator();
        ExecutorService executor = Executors.newFixedThreadPool(map.size());
        while (iterator.hasNext()) {
            Map.Entry me = (Map.Entry) iterator.next();
            Runnable runnable = new CourseTask((String) me.getKey(), (String) me.getValue());  //Task for each department
            executor.execute(runnable);
        }
        executor.shutdown();
        while (!executor.isTerminated()) {
        }
    }


    @Scheduled(cron = "0 0 6 * * *")
    public void updateCourseDataCronJob() {
        LOGGER.info("course data update cron task starting");
        fetchDepartmentData();
    }
}
