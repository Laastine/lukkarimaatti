package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.ltky.util.StringHelper;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
class ParserTest {
    private static final Logger logger = Logger.getLogger(ParserTest.class);

    //@Test
    public void parserTest() {
        ParserConfiguration config = ParserConfiguration.getInstance();
        try {
            Assert.assertNotNull(new URLParser().fetchStuff());
        } catch (Exception e) {
            logger.error("Error while fetching stuff from " + config.getUniURL(), e);
        }
    }


    //@Test
    public void checkEncoding() {
        StringHelper stringHelper = new StringHelper();
        try {
            //Check encoding of first given department
            logger.info(
                    "checkEncoding gives=" + stringHelper.checkEncoding(
                            new URLParser().fetchStuff().entrySet().iterator().next().getValue()
                    ));
        } catch (Exception e) {
            logger.error("test error", e);
        }
    }
}
