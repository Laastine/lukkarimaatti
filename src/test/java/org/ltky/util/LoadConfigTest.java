package org.ltky.util;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.ltky.parser.ParserConfiguration;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 26.11.2013
 */
public class LoadConfigTest {
    private static final Logger LOGGER = Logger.getLogger(LoadConfigTest.class);

    @Test
    public void loadTest() {
        ParserConfiguration parserConfig = ParserConfiguration.getInstance();
        try {
            Assert.assertNotNull(parserConfig.loadServletInitParameters());
            Assert.assertEquals("https://uni.lut.fi/fi/web/guest/lukujarjestykset", parserConfig.getUniURL());
        } catch (Exception e) {
            LOGGER.error("Exception caught", e);
        }
    }
}
