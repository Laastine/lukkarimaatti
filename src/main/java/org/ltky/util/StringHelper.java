package org.ltky.util;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
        if (firstWeek == null | "".equals(firstWeek)) {
            LOGGER.trace("Couldn't find pattern week from " + week);
            return null;
        }
        return firstWeek;
    }

    public <T> List<T> removeDuplicates(List<T> list) {
        return new ArrayList<T>(new LinkedHashSet<T>(list));
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
