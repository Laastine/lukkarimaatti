package org.ltky;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.ltky.util.EmailLink;

import java.util.ArrayList;
import java.util.List;

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

    @Test
    public void isValidEmail() {
        List<String> valid = new ArrayList() {{
            add("matti.mallikas@gmail.com");
            add("matti.mallikas@gmail.com");
            add("matti.mallikas@gmail.com");
            add("matti.mallikas@gmail.com");
            add("matti.mallikas@gmail.com");
        }};
        for (String s : valid) {
            Assert.assertTrue(emailLink.isValidEmailAddress(s));
        }
    }

    @Test
    public void notValidEmail() {
        List<String> notSoValid = new ArrayList() {{
            add("matti.mallikasgmail.com");
            add("matti.mallikas@gmailcom");
            add("mattimallikasgmailcom");
            add("@gmail.com");
            add("matti.mallikas@gmail");
        }};
        for (String s : notSoValid) {
            Assert.assertFalse(emailLink.isValidEmailAddress(s));
        }
    }
}
