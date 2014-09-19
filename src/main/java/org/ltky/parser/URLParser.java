package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.ltky.util.Util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class URLParser {
    private static final Logger LOGGER = Logger.getLogger(URLParser.class);
    private static final String prefix = "https://uni.lut.fi";
    private final ParserConfiguration parserConfiguration = ParserConfiguration.getInstance();
    private final Util UTIL = Util.getInstance();

    /**
     * Parse each departments url
     *
     * @return
     * @throws IOException
     */
    public Map<String, String> fetchStuff() throws IOException {
        final String uniURL = parserConfiguration.getUniURL();
        final Map<String, String> dependencies = new LinkedHashMap<>();
        final Queue<String> queue = initDepart2UrlMap();
        final String COURSE_URL_PATTERN = "\\/fi\\/c\\/document_library\\/get_file\\?uuid=[a-z0-9\\-]*&amp;groupId=10304";
        String linkList = StringUtils.substringBetween(fetchFromWeb(uniURL), parserConfiguration.getStartTag(), parserConfiguration.getEndTag());
        LOGGER.debug("linkList=" + linkList);
        String link = "";
        Pattern pattern = Pattern.compile(COURSE_URL_PATTERN);
        Matcher matcher = pattern.matcher(linkList);
        while (matcher.find()) {
            link = prefix + matcher.group();
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug("Department=" + queue.peek() + ", \nlink=" + link);
            }
            dependencies.put(queue.poll(), link);
        }
        return dependencies;
    }

    public String fetchExamURL() throws IOException {
        final String examURL = parserConfiguration.getExamURL();
        UTIL.writeToFile(fetchFromWeb(examURL), "test.txt");
        return prefix + StringUtils.substringBetween(fetchFromWeb(examURL), parserConfiguration.getExamStartTag(), parserConfiguration.getExamEndTag());
    }

    private final LinkedList<String> initDepart2UrlMap() {
        final LinkedList<String> list = new LinkedList() {{
            add("ente"); add("ymte"); add("kete");
            add("kote"); add("sate"); add("tite");
            add("tuta"); add("kati"); add("mafy");
            add("kike"); add("kv");
        }};
        return list;
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
