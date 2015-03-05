package org.ltky.parser;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.ltky.util.Util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class URLParser {
    private static final Logger LOGGER = Logger.getLogger(URLParser.class);
    private static final String prefix = "https://uni.lut.fi";
    private final ParserConfiguration parserConfiguration = ParserConfiguration.getInstance();
    private final Util UTIL = Util.getInstance();
    private final HashMap acronymMap = new HashMap<String, String>() {{
        put("Energiatekniikka", "ente");
        put("Ymp&Atilde;&curren;rist&Atilde;&para;tekniikka", "ymte");
        put("Kemiantekniikka", "kete");
        put("Konetekniikka", "kote");
        put("S&Atilde;&curren;hk&Atilde;&para;tekniikka", "sate");
        put("Tietotekniikka", "tite");
        put("Tuotantotalous", "tuta");
        put("Kauppatieteet", "kati");
        put("Laskennallinen&nbsp; tekniikka", "mafy");
        put("Kielikeskus", "kike");
        put("IBTM-intensiivit", "kv");
    }};

    /**
     * Parse each departments url
     *
     * @return
     * @throws Exception
     */
    public Map<String, String> parseLinks() throws Exception {
        final String uniURL = parserConfiguration.getUniURL();
        final Map<String, String> dependencies = new LinkedHashMap<>();
        Document document = Jsoup.parse(new URL(uniURL).openStream(), "cp1252", uniURL);
        Elements elements = document.select(".journal-content-article").select("a");
        elements.stream().forEach(a -> {
            if (a.attr("href").contains("/c/document_library/get_file") && !a.text().equals("") && !a.text().equals("täältä")) {
                dependencies.put(acronymMap.get(StringEscapeUtils.escapeHtml4(a.text())).toString(), "https://uni.lut.fi" + a.attr("href"));
            }
        });
        dependencies.entrySet().stream().map(d -> dependencies.put(acronymMap.get(d.getKey()).toString(), d.getValue()));
        LOGGER.debug("deps=" + dependencies);
        return dependencies;
    }

    public String fetchExamURL() throws Exception {
        final String examURL = parserConfiguration.getExamURL();
        UTIL.writeToFile(fetchFromWeb(examURL), "test.txt");
        return prefix + StringUtils.substringBetween(fetchFromWeb(examURL), parserConfiguration.getExamStartTag(), parserConfiguration.getExamEndTag());
    }

    /**
     * Returns UTF-8 string presentation of HTML page from given URL
     *
     * @param fromUrl
     * @return
     * @throws IOException
     */
    private String fetchFromWeb(final String fromUrl) throws Exception {
        final List<String> list = new BufferedReader(new InputStreamReader(new URL(fromUrl).openStream()))
                .lines().collect(Collectors.toList());
        return StringUtils.join(list.toArray());
    }
}
