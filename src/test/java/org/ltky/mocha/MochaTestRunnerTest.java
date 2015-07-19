package org.ltky.mocha;

import org.junit.Test;
import org.ltky.JettyTestRunner;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


/**
 * Created by laastine on 18/07/15.
 */
public class MochaTestRunnerTest {

    @Test
    public void mochaTest() throws Exception {
        JettyTestRunner.startJetty();
        String[] cmd = {"node_modules/mocha-phantomjs/bin/mocha-phantomjs", "-R", "spec", "http://localhost:" + JettyTestRunner.PORT + "/lukkarimaatti/test/runner.html"};
        Process ps = Runtime.getRuntime().exec(cmd);
        assertTrue(ps.waitFor(10, TimeUnit.SECONDS));
        assertEquals(0, ps.exitValue());
        JettyTestRunner.stopJetty();
    }

}
