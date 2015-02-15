package org.ltky.util;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 6.12.2013
 */
public class Util {
    private static final Logger LOGGER = Logger.getLogger(Util.class);
    private static Util instance;

    public static Util getInstance() {
        if (instance == null) {
            instance = new Util();
        }
        return instance;
    }

    /**
     * Extract certain pattern from given string
     *
     * @param input
     * @param pattern
     * @return
     * @throws IllegalStateException
     */
    public boolean extractPattern(String input, String pattern) throws IllegalStateException {
        final Pattern p = Pattern.compile(pattern);
        final Matcher matcher = p.matcher(input);
        while (matcher.find())
            if ("".equals(matcher.group())) {
                LOGGER.trace("Couldn't find pattern=" + pattern + " from " + input);
                return false;
            }
        return true;
    }

    /**
     * Extract week pattern from given string i.e. 1 or 2 digit number passes
     *
     * @param week
     * @return
     */
    public String extractWeek(String week) {
        String firstWeek = null;
        final Matcher matcher = Pattern.compile("(^[0-9]{2}|^[1-9])").matcher(week);
        while (matcher.find()) {
            firstWeek = matcher.group();
        }
        if (StringUtils.isBlank(firstWeek)) {
            LOGGER.trace("Couldn't find pattern week from " + week);
            return null;
        }
        return firstWeek;
    }

    /**
     * Put week numbers to nice sequence list e.g. 2-4,6,10-12 -> 2,3,4,6,10,11,12
     *
     * @param weeks
     * @return
     */
    public String processWeekNumbers(final String weeks) {
        final String dash = "-";
        final String comma = ",";
        final Set<Integer> weekSequence = new HashSet<>();
        if (StringUtils.isBlank(weeks)) {
            return "";
        } else {
            if (StringUtils.contains(weeks, dash)) {
                final Set<String> allMatches = new HashSet();
                final Matcher m = Pattern.compile("[0-9]{1,2}-[0-9]{1,2}").matcher(weeks);
                while (m.find()) {
                    allMatches.add(m.group());
                }
                allMatches.stream().forEach(match -> {
                    int start = Integer.valueOf(StringUtils.substringBefore(String.valueOf(match), dash));
                    int end = Integer.valueOf(StringUtils.substringAfterLast(String.valueOf(match), dash));
                    weekSequence.addAll(IntStream.rangeClosed(start, end)
                            .boxed()
                            .collect(Collectors.toList()));
                });
            }
        }
        final Matcher m = Pattern.compile("[0-9]+").matcher(weeks);
        while (m.find()) {
            weekSequence.add(Integer.valueOf(m.group()));
        }
        final Object[] list = weekSequence.toArray();
        Arrays.sort(list, (a, b) -> ((Integer) a) - ((Integer) b));
        final StringBuilder builder = new StringBuilder();
        Arrays.asList(list).stream().forEach(number -> builder.append(String.valueOf(number)).append(comma));
        return StringUtils.removeEnd(builder.toString(), comma);
    }

    public <T> List<T> removeDuplicates(List<T> list) {
        return list.stream().distinct().collect(Collectors.toList());
    }

    /**
     * Write content of toFile to file which name is fileName
     *
     * @param toFile
     * @param fileName
     * @throws java.io.IOException
     */
    public void writeToFile(String toFile, String fileName) throws IOException {
        FileUtils.write(new File(fileName), toFile, "ISO-8859-1");
    }
}
