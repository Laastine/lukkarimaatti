package org.ltky.util;

import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

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
    public void isValidEmail() {
        List<String> valid = new ArrayList<String>() {{
            add("matti.mall45ikas@gma46il.com");
            add("maasdbftti.mallikas@gmatyil.com");
            add("matti.maasdllikas@kapsi.fi");
            add("matti.mallikas@lut.fi");
            add("madbfatti.mal23likas@gmail.com");
        }};
        for (String s : valid) {
            assertTrue(emailLink.isValidEmailAddress(s));
        }
    }

    @Test
    public void notValidEmail() {
        List<String> notSoValid = new ArrayList<String>() {{
            add("matti.mallikasgmail.com");
            add("matti.mallikas@gmailcom");
            add("mattimallikasgmailcom");
            add("@gmail.com");
            add("matti.mallikas@gmail");
        }};
        for (String s : notSoValid) {
            assertFalse(emailLink.isValidEmailAddress(s));
        }
    }
}
