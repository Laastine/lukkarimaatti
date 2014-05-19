package org.ltky.parser;


import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 13.5.2014
 */
public class RESTIntegrationTest {

    private static final Logger LOGGER = Logger.getLogger(RESTIntegrationTest.class);

    private static final String NAMES_QUERY_URL = "http://localhost:8085/lukkarimaatti/rest/names/Tietokannat";
    private static final String EXAM_NAMES_QUERY_URL = "http://localhost:8085/lukkarimaatti/rest/examnames/Tietokannat";
    private static final String NAMES_QUERY_RESULT = "[\"Tietokannat\",\"Tietokannat\",\"Tietokannat\"]";
    private static final String EXAM_QUERY_RESULT = "[[\"Tietokannat\",\"CT60A4301\",\"26.9/16, 25.11/16, 6.5/8, 21.5/16, \"]]";
    private static final String NONSENSE = "foobar";
    private Client client;

    @Before
    public void init() {
        client = Client.create();
    }

    @Test
    public void namesTest() throws Exception {

        WebResource webResource = client.resource(NAMES_QUERY_URL);
        String response = webResource.get(String.class);
        assertThat(response, is(NAMES_QUERY_RESULT));
        assertTrue(!response.equals(is(NONSENSE)));
    }

    @Test
    public void examTest() {
        WebResource webResource = client.resource(EXAM_NAMES_QUERY_URL);
        String response = webResource.get(String.class);
        assertThat(response, is(EXAM_QUERY_RESULT));
        assertTrue(!response.equals(is(NONSENSE)));
    }

}
