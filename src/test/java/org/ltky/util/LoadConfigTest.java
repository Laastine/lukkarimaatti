package org.ltky.util;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.ltky.parser.ParserConfiguration;

import static org.junit.Assert.*;

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
        LOGGER.info("test="+LOGGER.getEffectiveLevel().toString());
        ParserConfiguration parserConfig = ParserConfiguration.getInstance();
        assertNotNull(parserConfig);
        try {
            assertNotNull(parserConfig.loadServletInitParameters());
            assertEquals("https://uni.lut.fi/fi/web/guest/lukujarjestykset1", parserConfig.getUniURL());
        } catch (Exception e) {
            LOGGER.error("Exception caught", e);
            fail("load config failed");
        }
    }
}
