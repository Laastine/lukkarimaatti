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
     * @param courseAction
     * @param pattern
     * @return
     * @throws IllegalStateException
     */
    public String extractPattern(String courseAction, String pattern) throws IllegalStateException {
        String resultSet = "";
        Pattern p = Pattern.compile(pattern);
        Matcher matcher = p.matcher(courseAction);
        while (matcher.find()) {
            resultSet = matcher.group();
        }
        if (resultSet == null || resultSet.length() == 0) {
            LOGGER.trace("Couldn't find pattern=" + pattern + " from " + courseAction);
            return null;
        }
        return resultSet;
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

    public void writeToFile(ArrayList<String> toFile, String fileName) throws IOException {
        String tmp = "";
        for (String s : toFile)
            tmp += s + "\n";
        FileUtils.write(new File(fileName), tmp, "ISO-8859-1");
    }
}
