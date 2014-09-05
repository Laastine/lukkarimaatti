package org.ltky.parser;

import org.junit.Before;
import org.junit.Test;
import org.ltky.util.EmailLink;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 4.9.2014
 */
public class EmailTest {

    private EmailLink emailLink;

    @Before
    public void init() {
        emailLink = new EmailLink();
    }

    @Test
    public void sendMail() {
        emailLink.buildMail("laastine@kapsi.fi", "Hello from Junit!");
    }
}
