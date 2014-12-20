package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * @author laastine
 */
public class ParserConfiguration {
    private static final Logger LOGGER = LoggerFactory.getLogger(ParserConfiguration.class);
    private static ParserConfiguration instance;
    private String uniURL;
    private String examURL;
    private String startTag;
    private String endTag;
    private String examStartTag;
    private String examEndTag;
    private String emailUsername;
    private String emailPassword;

    private ParserConfiguration() {
        try {
            loadServletInitParameters();
        } catch (Exception e) {
            LOGGER.info("Property loading failed ", e);
        }
    }

    public static ParserConfiguration getInstance() {
        if (instance == null) {
            instance = new ParserConfiguration();
        }
        return instance;
    }

    public String loadServletInitParameters() throws IOException {
        Properties parserProperties = loadProperties();
        uniURL = getPropertyOrThrowUp(parserProperties, "uniURL");
        examURL = getPropertyOrThrowUp(parserProperties, "examURL");
        startTag = getPropertyOrThrowUp(parserProperties, "startTag");
        endTag = getPropertyOrThrowUp(parserProperties, "endTag");
        examStartTag = getPropertyOrThrowUp(parserProperties, "examStartTag");
        examEndTag = getPropertyOrThrowUp(parserProperties, "examEndTag");
        emailUsername = getPropertyOrThrowUp(parserProperties, "emailUsername");
        emailPassword = getPropertyOrThrowUp(parserProperties, "emailPassword");
        LOGGER.info("Config=" + this.toString());
        return this.toString();
    }

    private Properties loadProperties() throws IOException {
        Properties properties = new Properties();
        String path = "lukkarimaatti.properties";
        ClassPathResource classPathResource = new ClassPathResource(path);
        FileInputStream fis = new FileInputStream(classPathResource.getFile());
        properties.load(fis);
        return properties;
    }

    private String getPropertyOrThrowUp(Properties properties, String key) {
        String p = properties.getProperty(key);
        if (StringUtils.isBlank(p))
            throw new IllegalStateException("Property missing or value empty: key=" + key);
        return p;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }

    public String getUniURL() {
        return uniURL;
    }

    public String getExamURL() {
        return examURL;
    }

    public String getStartTag() {
        return startTag;
    }

    public String getEndTag() {
        return endTag;
    }

    public String getExamStartTag() {
        return examStartTag;
    }

    public String getExamEndTag() {
        return examEndTag;
    }

    public String getEmailUsername() {
        return emailUsername;
    }

    public String getEmailPassword() {
        return emailPassword;
    }
}
