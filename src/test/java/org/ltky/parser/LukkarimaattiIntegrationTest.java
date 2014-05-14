package org.ltky.parser;


import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import org.apache.log4j.Logger;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 13.5.2014
 */
public class LukkarimaattiIntegrationTest {

    private static final String URL = "http://localhost:8085/lukkarimaatti/rest/names/Tietokannat";
    private static final Logger LOGGER = Logger.getLogger(LukkarimaattiIntegrationTest.class);

    @Test
    public void testHello() throws Exception {
        Client client = Client.create();
        WebResource webResource = client.resource(URL);
        String response = webResource.get(String.class);
        LOGGER.info("response="+response);
        assertThat(response, is("[\"Tietokannat\",\"Tietokannat\",\"Tietokannat\"]"));
    }
}
