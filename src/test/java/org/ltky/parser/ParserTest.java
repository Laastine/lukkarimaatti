package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
public class ParserTest {
    private static final Logger logger = Logger.getLogger(ParserTest.class);

    @Test
    public void parserTest() {
        ParserConfiguration config = ParserConfiguration.getInstance();
        try {
            Assert.assertNotNull(new Parser().fetchStuff(config.getUniURL()));
        } catch (Exception e) {
            logger.error("Error while fetching stuff from " + config.getUniURL(), e);
        }
    }
}
