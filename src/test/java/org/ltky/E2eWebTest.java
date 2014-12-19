package org.ltky;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.ltky.config.WebConfig;
import org.ltky.task.TaskConfigurer;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.fail;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = {WebConfig.class})
public class E2eWebTest {
    private WebDriver driver;
    private String baseUrl;
    private boolean acceptNextAlert = true;
    private StringBuffer verificationErrors = new StringBuffer();
    private static final Logger LOGGER = LoggerFactory.getLogger(E2eWebTest.class);
    private ExecutorService executorService = Executors.newFixedThreadPool(1);
    @Autowired
    private TaskConfigurer taskConfigurer;

    @Before
    public void setUp() throws Exception {
        executorService.execute(new EmbeddedJetty());
        /*
        try {
            taskConfigurer.setUpRunners();
        } catch (Exception e) {
            LOGGER.error("Error while saving course data to DB", e);
        }
        */
        baseUrl = "http://localhost:8085";
        loadFirefoxDriver();
        //loadChromeDriver();
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
    }

    private void loadFirefoxDriver() {
        driver = new FirefoxDriver();
    }

    private void loadChromeDriver() throws MalformedURLException, InterruptedException {
        // To remove message "You are using an unsupported command-line flag: --ignore-certificate-errors.
        // Stability and security will suffer."
        // Add an argument 'test-type'
        DesiredCapabilities capabilities = DesiredCapabilities.chrome();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("test-type");
        capabilities.setCapability(ChromeOptions.CAPABILITY, options);
        driver = new RemoteWebDriver(new URL("http://localhost:8085/lukkarimaatti"), capabilities);
    }

    @Test
    public void testAllElementsAreVisible() throws Exception {
        driver.get(baseUrl + "/lukkarimaatti");
        driver.findElement(By.className("header"));
        driver.findElement(By.id("searchbar"));
        driver.findElement(By.id("calendar"));
        driver.findElement(By.id("footer"));
    }

    @After
    public void tearDown() throws Exception {
        driver.quit();
        executorService.shutdown();
        String verificationErrorString = verificationErrors.toString();
        if (!"".equals(verificationErrorString)) {
            fail(verificationErrorString);
        }
    }

    private boolean isElementPresent(By by) {
        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private boolean isAlertPresent() {
        try {
            driver.switchTo().alert();
            return true;
        } catch (NoAlertPresentException e) {
            return false;
        }
    }

    private String closeAlertAndGetItsText() {
        try {
            Alert alert = driver.switchTo().alert();
            String alertText = alert.getText();
            if (acceptNextAlert) {
                alert.accept();
            } else {
                alert.dismiss();
            }
            return alertText;
        } finally {
            acceptNextAlert = true;
        }
    }
}
