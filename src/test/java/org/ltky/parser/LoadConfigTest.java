package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 26.11.2013
 */
public class LoadConfigTest {
    private static final Logger logger = Logger.getLogger(LoadConfigTest.class);

    //@Test
    public void loadTest() {
        ParserConfiguration parserConfig = ParserConfiguration.getInstance();
        try {
            Assert.assertNotNull(parserConfig.loadServletInitParameters());
        } catch (Exception e) {
            logger.error("Exception caught", e);
        }
    }
}
