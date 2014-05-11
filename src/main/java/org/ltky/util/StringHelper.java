package org.ltky.util;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 6.12.2013
 */
public class StringHelper {
    private static final Logger LOGGER = Logger.getLogger(StringHelper.class);

    /**
     * Extract certain pattern from given string
     *
     * @param input
     * @param pattern
     * @return
     * @throws IllegalStateException
     */
    public boolean extractPattern(String input, String pattern) throws IllegalStateException {
        Pattern p = Pattern.compile(pattern);
        Matcher matcher = p.matcher(input);
        while (matcher.find())
            if ("".equals(matcher.group())) {
                LOGGER.trace("Couldn't find pattern=" + pattern + " from " + input);
                return false;
            }
        return true;
    }

    public String extractWeek(String week) {
        String firstWeek = null;
        Matcher matcher = Pattern.compile("(^[0-9]{2}|^[1-9])").matcher(week);
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
        final Set<Integer> weekSequence = new HashSet();
        if(StringUtils.isBlank(weeks)) {
            return "";
        } else {
            if(StringUtils.contains(weeks, "-")) {
                final Set<String> allMatches = new HashSet();
                final Matcher m = Pattern.compile("[0-9]{1,2}-[0-9]{1,2}").matcher(weeks);
                while (m.find()) {
                    allMatches.add(m.group());
                }
                for (String match : allMatches) {
                    final int start = Integer.valueOf(StringUtils.substringBefore(match, dash));
                    final int end =  Integer.valueOf(StringUtils.substringAfterLast(match, dash));
                    final Set<Integer> intList = new HashSet<>();
                    for(int i = start; i < end; i++, intList.add(i));
                    weekSequence.addAll(intList);
                }
            }
            final Matcher m = Pattern.compile("[0-9]+").matcher(weeks);
            while (m.find()) {
                weekSequence.add(Integer.valueOf(m.group()));
            }
        }
        final Object[] list = weekSequence.toArray();
        Arrays.sort(list, (a, b) -> ((Integer) a) - ((Integer) b));
        final StringBuilder builder = new StringBuilder();
        for(Object o : list) {
            builder.append(String.valueOf(o)+",");
        }
        return StringUtils.removeEnd(builder.toString(), comma);
    }

    public <T> List<T> removeDuplicates(List<T> list) {
        return list.parallelStream().distinct().collect(Collectors.toList());
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

    public void writeToFile(List<String> toFile, String fileName) throws IOException {
        String tmp = "";
        for (String s : toFile) {
            tmp += s + "\n";
        }
        FileUtils.write(new File(fileName), tmp, "ISO-8859-1");
    }
}
