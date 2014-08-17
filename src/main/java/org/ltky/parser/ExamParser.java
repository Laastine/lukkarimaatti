package org.ltky.parser;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.ltky.model.Exam;
import org.ltky.util.CoursePattern;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 20.4.2014
 */
public class ExamParser {
    private static final Logger LOGGER = Logger.getLogger(ExamParser.class);
    private final CoursePattern coursePattern = new CoursePattern();

    public ExamParser() {
    }

    public Set<Exam> parseExams() throws IOException {
        return parseExamData(parseExamHTML());
    }

    /**
     * Select table class=spreadsheet elements from given HMTL
     *
     * @param url
     * @return
     * @throws IllegalStateException
     * @throws java.io.IOException
     */
    private final Elements getTableElements(String url) throws IllegalStateException, IOException {
        Document doc = Jsoup.parse(
                new URL(url).openStream(),
                "cp1252",   //Set to null to determine from http-equiv meta tag, if present, or fall back to UTF-8
                url);
        return doc.select("body").select("table").select("tr").select("td");
    }

    /**
     * Parses (HTML) table <tr></tr> -element data
     * e.g.
     * <p>
     * <td bgcolor="#FFF0D7" width="75">A310A0100</td>
     * <td bgcolor="#FFF0D7" width="290"><b>Strateginen hankintatoimi</b></td>
     * <td bgcolor="#FFE9DD">12.12/8</td>
     * <td bgcolor="#F0D3CC">7.1/16</td>
     * <td bgcolor="#E9BFBB">19.2/16</td>
     * <td bgcolor="#DDAAAA">8.4/16</td>
     * <td bgcolor="#DDAAAA">-</td>
     *
     * @return
     * @throws IOException
     */
    private List<String> parseExamHTML() throws IOException {
        final List<String> resultSet = new ArrayList<>();
        final URLParser urlParser = new URLParser();
        Elements e = getTableElements(urlParser.fetchExamURL());
        for (Element i : e) {
            Elements rowItems = i.select("tr");
            for (Element j : rowItems) {
                Elements tds = j.select("td");
                String item = tds.text();
                if (!StringUtils.isBlank(item)) {
                    LOGGER.debug(item);
                    resultSet.add(item);
                }
            }
        }
        resultSet.forEach(LOGGER::debug);
        return resultSet;
    }

    /**
     * Creates exam entity object
     *
     * @param set
     */
    private Set<Exam> parseExamData(List<String> set) throws UnsupportedEncodingException {
        Exam exam = new Exam();
        final Set<Exam> examList = new HashSet();
        LOGGER.debug("set size=" + set.size());
        for (String examElement : set) {
            final String courseCode = new String(StringUtils.split(examElement, " ")[0].getBytes("cp1252"), "UTF-8");
            if (!StringUtils.isBlank(courseCode)) {
                exam.setCourseCode(StringUtils.trim(courseCode));
                final List<String> timeList = extractExamTimes(examElement);
                if (!timeList.isEmpty()) {
                    final String courseName = new String(StringUtils.substringBetween(examElement, courseCode, timeList.get(0)).getBytes("cp1252"), "UTF-8");
                    if (!StringUtils.isBlank(courseName))
                        exam.setCourseName(StringUtils.trim(courseName));
                    String examTimes = "";
                    for (String c : timeList) {
                        examTimes += c + ", ";
                    }
                    if (!StringUtils.isBlank(StringUtils.substringBeforeLast(examTimes, ",")))
                        exam.setExamTimes(new String(examTimes.getBytes("cp1252"), "UTF-8"));
                    examList.add(exam);
                }
                exam = new Exam();
            }
        }
        return examList;
    }

    /**
     * Extracts exam times from course exam entry
     * e.g.
     * BL20A0400 Sähkömarkkinat 17.10/8 24.10/16 5.12/16 22.1/16 -> 17.10/8 24.10/16 5.12/16 22.1/16
     *
     * @param exams
     * @return
     */
    private List<String> extractExamTimes(String exams) {
        List<String> allMatches = new ArrayList();
        Matcher m = Pattern.compile(coursePattern.getExamDate()).matcher(exams);
        while (m.find()) {
            allMatches.add(m.group());
        }
        if (allMatches == null) {
            LOGGER.trace("Couldn't find pattern from " + exams);
            return null;
        }
        return allMatches;
    }
}
