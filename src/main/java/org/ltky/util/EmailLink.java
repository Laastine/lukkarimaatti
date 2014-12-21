package org.ltky.util;

import org.apache.commons.validator.routines.EmailValidator;
import org.apache.log4j.Logger;
import org.ltky.parser.ParserConfiguration;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Properties;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 4.9.2014
 */
public class EmailLink {
    private final ParserConfiguration parserConfiguration;
    private static final Logger LOGGER = Logger.getLogger(EmailLink.class);

    public EmailLink() {
        parserConfiguration = ParserConfiguration.getInstance();
    }

    public void buildMail(String toAddress, String link) {
        final String fromEmail = parserConfiguration.getEmailUsername();
        final String password = parserConfiguration.getEmailPassword();
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        Authenticator auth = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        };
        try {
            Session session = Session.getInstance(props, auth);
            LOGGER.info("Sending email to=" + toAddress + " url=" + link);
            if (isValidEmailAddress(toAddress)) {
                sendEmail(session, toAddress, "Your lukkarimaatti url=" + link);
            } else {
                LOGGER.warn(toAddress+" isn't valid email address!");
            }
        } catch (Exception e) {
            LOGGER.error("Email sending failed to " + toAddress, e);
        }
    }

    public void sendEmail(Session session, String toEmail, String body) throws Exception {
        MimeMessage msg = new MimeMessage(session);
        msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
        msg.addHeader("format", "flowed");
        msg.addHeader("Content-Transfer-Encoding", "8bit");
        msg.setFrom(new InternetAddress(parserConfiguration.getEmailUsername(), parserConfiguration.getEmailUsername()));
        msg.setReplyTo(InternetAddress.parse(parserConfiguration.getEmailUsername(), false));
        msg.setSubject("Lukkarimaatti++ course url", "UTF-8");
        msg.setText(body, "UTF-8");
        msg.setSentDate(new Date());
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail, false));
        Transport.send(msg);
    }

    public boolean isValidEmailAddress(String emailAddress) {
        return EmailValidator.getInstance().isValid(emailAddress);
    }
}