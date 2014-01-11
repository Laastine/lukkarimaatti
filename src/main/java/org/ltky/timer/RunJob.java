package org.ltky.timer;

import org.apache.log4j.Logger;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.scheduling.quartz.QuartzJobBean;

import javax.annotation.PostConstruct;
import java.util.Date;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 26.11.2013
 */
class RunJob extends QuartzJobBean {
    private static final Logger logger = Logger.getLogger(RunJob.class);

    private FetchJob fetchJob;

    public void setRunMeTask(FetchJob fetchJob) {
        this.fetchJob = fetchJob;
    }

    @PostConstruct
    public void init() {
        logger.debug("init()");
        new ClassPathXmlApplicationContext("Spring-Quartz.xml");
    }

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        logger.debug("executeInternal()");
        //fetchJob.fetch();
        logger.info("New HTML files fetched "+new Date());
    }
}
