package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.ltky.util.Util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class URLParser {
    private final ParserConfiguration parserConfiguration = ParserConfiguration.getInstance();
    private static final Logger LOGGER = Logger.getLogger(URLParser.class);
    private static final String prefix = "https://uni.lut.fi";
    /**
     * Parse each departments url
     *
     * @return
     * @throws IOException
     */
    public Map<String, String> fetchStuff() throws IOException {
        final Map<String, String> resultSet = new HashMap<>();
        final String uniURL = parserConfiguration.getUniURL();
        final Map<String, String> dependencies = getProperties(uniURL);
        String linkList = StringUtils.substringBetween(fetchFromWeb(uniURL), parserConfiguration.getStartTag(), parserConfiguration.getEndTag());
        LOGGER.debug("linkList=" + linkList);
        String link = "";
        for (Map.Entry me : dependencies.entrySet()) {
            String department = me.toString();
            department = department.substring(StringUtils.indexOfAny(department, "=") + 1, department.length());
            Pattern pattern = Pattern.compile("<a href=.+" + me.getKey());
            Matcher matcher = pattern.matcher(linkList);
            if (matcher.find()) {
                String tmp = matcher.group();
                if (StringUtils.contains(tmp, "\" target=")) {
                    link = prefix + StringUtils.substringBetween(tmp, "<a href=\"", "\" target=");
                } else {
                    link = prefix + StringUtils.substringBetween(tmp, "<a href=\"", "\"><br ");
                }
            }
            linkList = StringUtils.substringAfter(linkList, "10304");
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug("Department=" + department + ", link=" + link);
            }
            resultSet.put(department, link);
        }
        return resultSet;
    }

    public String fetchExamURL() throws IOException {
        final String examURL = parserConfiguration.getExamURL();
        new Util().writeToFile(fetchFromWeb(examURL), "test.txt");
        return prefix + StringUtils.substringBetween(fetchFromWeb(examURL), parserConfiguration.getExamStartTag(), parserConfiguration.getExamEndTag());
    }

    private Map getProperties(final String uniURL) {
        final Map<String, String> dependencies = new LinkedHashMap<>();
        LOGGER.info("Fetching: " + uniURL);
        dependencies.put(parserConfiguration.getEnte(), "ente");
        dependencies.put(parserConfiguration.getYmte(), "ymte");
        dependencies.put(parserConfiguration.getKete(), "kete");
        dependencies.put(parserConfiguration.getKote(), "kote");
        dependencies.put(parserConfiguration.getSate(), "sate");
        dependencies.put(parserConfiguration.getTite(), "tite");
        dependencies.put(parserConfiguration.getTuta(), "tuta");
        dependencies.put(parserConfiguration.getKati(), "kati");
        dependencies.put(parserConfiguration.getMafy(), "mafy");
        //dependencies.put(parserConfiguration.getKike(), "kike");  Waits for implementation
        dependencies.put(parserConfiguration.getKv(), "kv");
        return dependencies;
    }

    /**
     * Returns UTF-8 string presentation of HTML page from given URL
     *
     * @param fromUrl
     * @return
     * @throws IOException
     */
    private String fetchFromWeb(final String fromUrl) throws IOException {
        final List<String> list = new BufferedReader(new InputStreamReader(new URL(fromUrl).openStream()))
                .lines().collect(Collectors.toList());
        return StringUtils.join(list.toArray());
    }
}
