package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.HashMap;
import java.util.Set;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class URLParser {
    private final ParserConfiguration parserConfiguration = ParserConfiguration.getInstance();
    private static final Logger LOGGER = Logger.getLogger(URLParser.class);

    /**
     * Parse each departments url
     *
     * @return
     * @throws IOException
     */
    public Map<String, String> fetchStuff() throws IOException {
        String uniURL = parserConfiguration.getUniURL();
        LOGGER.info("Fetching: " + uniURL);
        final Map<String, String> dependencies = new LinkedHashMap<>();
        dependencies.put(parserConfiguration.getEnte(), "ente");
        dependencies.put(parserConfiguration.getYmte(), "ymte");
        dependencies.put(parserConfiguration.getKete(), "kete");
        dependencies.put(parserConfiguration.getKote(), "kote");
        dependencies.put(parserConfiguration.getSate(), "sate");
        dependencies.put(parserConfiguration.getTite(), "tite");
        dependencies.put(parserConfiguration.getTuta(), "tuta");
        dependencies.put(parserConfiguration.getKati(), "kati");
        dependencies.put(parserConfiguration.getMafy(), "mafy");
        dependencies.put(parserConfiguration.getKike(), "kike");
        dependencies.put(parserConfiguration.getKv(), "kv");
        String startMark = parserConfiguration.getStartTag();
        String endMark = parserConfiguration.getEndTag();
        Map<String, String> resultSet = new HashMap<>();
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("startMark=" + startMark + ", endMark=" + endMark);
        }
        String linkList = StringUtils.substringBetween(fetchFromWeb(uniURL), startMark, endMark);
        String prefix = "https://uni.lut.fi";
        String link = "";
        Set set = dependencies.entrySet();
        Iterator iterator = set.iterator();
        for (int i = 0; i < dependencies.size(); i++) {
            Map.Entry me = (Map.Entry) iterator.next();
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

    /**
     * Returns UTF-8 string from given URL
     *
     * @param fromUrl
     * @return
     * @throws IOException
     */
    String fetchFromWeb(String fromUrl) throws IOException {
        String content = "";
        String inputLine;
        URL url = new URL(fromUrl);
        BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
        while ((inputLine = in.readLine()) != null) {
            content += inputLine;
        }
        in.close();
        return new String(content.getBytes(), "UTF8");
    }
}
