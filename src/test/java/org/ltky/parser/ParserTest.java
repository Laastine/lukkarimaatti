package org.ltky.parser;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.ltky.util.StringHelper;

import java.util.Map;

/**
 * parser
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 27.11.2013
 */
public class ParserTest {
    private static final Logger LOGGER = Logger.getLogger(ParserTest.class);

    //@Test
    public void parserTest() {
        ParserConfiguration config = ParserConfiguration.getInstance();
        URLParser parser = new URLParser();
        try {
            Map<String, String> map = parser.fetchStuff();
            //Assert.assertNotNull(map);
            for(String s : map.keySet()) {
                LOGGER.debug("Department="+s);
            }
        } catch (Exception e) {
            LOGGER.error("Error while fetching stuff from " + config.getUniURL(), e);
        }
    }

}
