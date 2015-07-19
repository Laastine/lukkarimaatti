package org.ltky.mocha;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.ltky.EmbeddedJetty;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


/**
 * Created by laastine on 18/07/15.
 */
public class MochaTestRunnerTest {
    private static final Logger LOGGER = Logger.getLogger(MochaTestRunnerTest.class);

    @Test
    public void mochaTest() throws Exception {
        EmbeddedJetty.startJetty();
        String[] cmd = {"../../../node_modules/mocha-phantomjs/bin/mocha-phantomjs", "-R", "spec", "http://localhost:" + EmbeddedJetty.PORT + "/lukkarimaatti/test/runner.html"};
        Process ps = Runtime.getRuntime().exec(cmd);
        assertTrue(ps.waitFor(60, TimeUnit.SECONDS));
        assertEquals(0, ps.exitValue());
        EmbeddedJetty.stopJetty();
    }

}
