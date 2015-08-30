package org.ltky.parser;

import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import java.net.URL;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class URLParser {
    private static final Logger LOGGER = Logger.getLogger(URLParser.class);
    private static final String prefix = "https://uni.lut.fi";
    private final ParserConfiguration parserConfiguration = ParserConfiguration.getInstance();
    private final HashMap acronymMap = new HashMap<String, String>() {{
        put("Energiatekniikka", "ente");
        put("Ympäristötekniikka", "ymte");
        put("Kemiantekniikka", "kete");
        put("Konetekniikka", "kote");
        put("Sähkötekniikka", "sate");
        put("Tietotekniikka", "tite");
        put("Tuotantotalous", "tuta");
        put("Kauppatieteet", "kati");
        put("Laskennallinen  tekniikka", "mafy");
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
        Document document = Jsoup.parse(new URL(uniURL).openStream(), null, uniURL);
        Elements elements = document.select(".journal-content-article").select("a");
        elements.stream().forEach(a -> {
            if (a.attr("href").contains("/c/document_library/get_file") && !a.text().equals("") && !a.text().equals("täältä")) {
                dependencies.put(acronymMap.get(a.text()).toString(), prefix + a.attr("href"));
            }
        });
        dependencies.entrySet().stream().map(d -> dependencies.put(acronymMap.get(d.getKey()).toString(), d.getValue()));
        LOGGER.info("deps=" + dependencies.entrySet().stream().map(d -> "\n" + d.getKey() + ":" + d.getValue()).collect(Collectors.toList()));
        return dependencies;
    }
}
