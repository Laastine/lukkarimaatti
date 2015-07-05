package org.ltky.parser;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.ltky.util.Util;

import java.net.URL;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

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
}
