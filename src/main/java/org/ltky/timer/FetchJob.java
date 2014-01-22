package org.ltky.timer;

import org.apache.log4j.Logger;
import org.ltky.parser.URLParser;
import org.ltky.parser.ParserTask;
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
public class FetchJob {
    private static final Logger LOGGER = Logger.getLogger(FetchJob.class);
    private Map<String, String> map;
    @Resource
    Properties lukkariProperties;

    private void getLinks() {
        try {
            map = new URLParser().fetchStuff();
        } catch (IOException e) {
            LOGGER.error("Malformed UNI URL", e);
        }
    }

    /**
     * Fetch data for departments
     */
    public void fetch() {
        Iterator iterator = map.entrySet().iterator();
        ExecutorService executor = Executors.newFixedThreadPool(map.size());
        while (iterator.hasNext()) {
            Map.Entry me = (Map.Entry) iterator.next();
            if(LOGGER.isDebugEnabled())
                LOGGER.debug("Key=" + me.getKey() + " Value=" + me.getValue());
            Runnable worker = new ParserTask((String) me.getKey(), (String) me.getValue());  //Task for each department
            executor.execute(worker);
        }
        executor.shutdown();
        while (!executor.isTerminated()) {
        }
        LOGGER.info("Finished all threads");
    }

    @Scheduled(cron = "00 6 * * * ?")
    public void runCron() {
        if(LOGGER.isDebugEnabled())
            LOGGER.debug("cron task");
        //getLinks();
        //fetch();
        //fetchJob.fetch();
    }

}
