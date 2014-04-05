package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.log4j.Logger;
import org.springframework.core.io.ClassPathResource;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * @author laastine
 */
public class ParserConfiguration {
    private String uniURL;
    private String startTag;
    private String endTag;
    private String folder;
    private String ente;
    private String ymte;
    private String kete;
    private String kote;
    private String sate;
    private String tite;
    private String tuta;
    private String kati;
    private String mafy;
    private String kike;
    private String kv;

    private String period1;
    private String period2;
    private String period3;
    private String period4;

    private String timer;
    private static ParserConfiguration instance;
    private static final Logger LOGGER = Logger.getLogger(ParserConfiguration.class);

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
        startTag = getPropertyOrThrowUp(parserProperties, "startTag");
        endTag = getPropertyOrThrowUp(parserProperties, "endTag");
        folder = getPropertyOrThrowUp(parserProperties, "folder");
        ente = getPropertyOrThrowUp(parserProperties, "ente");
        ymte = getPropertyOrThrowUp(parserProperties, "ymte");
        kete = getPropertyOrThrowUp(parserProperties, "kete");
        kote = getPropertyOrThrowUp(parserProperties, "kote");
        sate = getPropertyOrThrowUp(parserProperties, "sate");
        tite = getPropertyOrThrowUp(parserProperties, "tite");
        tuta = getPropertyOrThrowUp(parserProperties, "tuta");
        kati = getPropertyOrThrowUp(parserProperties, "kati");
        mafy = getPropertyOrThrowUp(parserProperties, "mafy");
        //kike = getPropertyOrThrowUp(parserProperties, "kike");    Waits implementation
        kv = getPropertyOrThrowUp(parserProperties, "kv");
        period1 = getPropertyOrThrowUp(parserProperties, "period1");
        period2 = getPropertyOrThrowUp(parserProperties, "period2");
        period3 = getPropertyOrThrowUp(parserProperties, "period3");
        period4 = getPropertyOrThrowUp(parserProperties, "period4");
        timer = getPropertyOrThrowUp(parserProperties, "timer");
        LOGGER.info("Config=" + this.toString());
        return this.toString();
    }

    private Properties loadProperties() throws IOException {
        Properties properties = new Properties();
        String path = "properties/parser.properties";
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

    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }

    public String getUniURL() {
        return uniURL;
    }

    public String getStartTag() {
        return startTag;
    }

    public String getEndTag() {
        return endTag;
    }

    public String getEnte() {
        return ente;
    }

    public String getYmte() {
        return ymte;
    }

    public String getKete() {
        return kete;
    }

    public String getKote() {
        return kote;
    }

    public String getSate() {
        return sate;
    }

    public String getTite() {
        return tite;
    }

    public String getTuta() {
        return tuta;
    }

    public String getKati() {
        return kati;
    }

    public String getMafy() {
        return mafy;
    }

    public String getKike() {
        return kike;
    }

    public String getKv() {
        return kv;
    }

    public String getFolder() {
        return folder;
    }

    public String getTimer() {
        return timer;
    }

    public String getPeriod1() {
        return period1;
    }

    public String getPeriod2() {
        return period2;
    }

    public String getPeriod3() {
        return period3;
    }

    public String getPeriod4() {
        return period4;
    }
}
