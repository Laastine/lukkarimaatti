package org.ltky.util;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.mozilla.universalchardet.UniversalDetector;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.charset.CharsetEncoder;
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
    private static final Logger logger = Logger.getLogger(StringHelper.class);
    private static final CharsetEncoder encoder = Charset.forName("UTF-8").newEncoder();

    /**
     * Change encoding of given string
     * @param text
     * @return
     */
    public String changeEncoding(String text) {
        final Charset windowsCharset = Charset.forName("cp1252");
        final Charset utfCharset = Charset.forName("UTF-8");
        final CharBuffer windowsEncoded = windowsCharset.decode(ByteBuffer.wrap(text.getBytes()));
        return new String(utfCharset.encode(windowsEncoded).array());
    }

    public String changeEncoding1(String text) {
        final Charset windowsCharset = Charset.forName("UTF-8");
        final Charset utfCharset = Charset.forName("cp1252");
        final CharBuffer windowsEncoded = windowsCharset.decode(ByteBuffer.wrap(text.getBytes()));
        return new String(utfCharset.encode(windowsEncoded).array());
    }

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
            logger.trace("Couldn't find pattern=" + pattern + " from " + courseAction);
            return null;
        }
        return resultSet;
    }

    public String checkEncoding(String input) {
        UniversalDetector detector = new UniversalDetector(null);
        detector.handleData(input.getBytes(), 0, input.length());
        detector.dataEnd();
        String encoding = detector.getDetectedCharset();
        detector.reset();
        return encoding;
    }

    /**
     * Check that given String is printable with UTF-8 encoding
     *
     * @param v
     * @return
     */
    public static boolean isPrintable(String v) {
        return encoder.canEncode(v);
    }

    public <T> List<T> removeDuplicates(List<T> list) {
        return new ArrayList<>(new LinkedHashSet<>(list));
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
