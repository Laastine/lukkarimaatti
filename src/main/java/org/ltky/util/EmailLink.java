package org.ltky.util;

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
    private ParserConfiguration parserConfiguration;
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
        Session session = Session.getInstance(props, auth);
        LOGGER.info("Sending email to="+toAddress+" url="+link);
        sendEmail(session, toAddress, "Lukkarimaatti++ course url", "Your lukkarimaatti url=" + link);
    }

    public void sendEmail(Session session, String toEmail, String subject, String body) {
        try {
            MimeMessage msg = new MimeMessage(session);
            msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
            msg.addHeader("format", "flowed");
            msg.addHeader("Content-Transfer-Encoding", "8bit");
            msg.setFrom(new InternetAddress(parserConfiguration.getEmailUsername(), parserConfiguration.getEmailUsername()));
            msg.setReplyTo(InternetAddress.parse(parserConfiguration.getEmailUsername(), false));
            msg.setSubject(subject, "UTF-8");
            msg.setText(body, "UTF-8");
            msg.setSentDate(new Date());
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail, false));
            Transport.send(msg);
        } catch (Exception e) {
            LOGGER.error("Email sending failed ", e);
        }
    }
}