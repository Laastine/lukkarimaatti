package org.ltky.e2e;

import org.apache.log4j.Logger;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.ltky.EmbeddedJetty;
import org.ltky.config.WebConfig;
import org.ltky.task.TaskConfigurer;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = {WebConfig.class})
public class E2eWebTest {
    private WebDriver driver;
    private String baseUrl;
    private final ExecutorService executorService = Executors.newFixedThreadPool(1);
    private static final Logger LOGGER = Logger.getLogger(E2eWebTest.class);
    @Autowired
    private TaskConfigurer taskConfigurer;
    private static final int TIMEOUT = 5;

    @Before
    public void setUp() throws Exception {
        executorService.execute(new EmbeddedJetty());

        try {
            taskConfigurer.setUpRunners();
        } catch (Exception e) {
            LOGGER.error("Error while saving course data to DB", e);
        }

        baseUrl = "http://localhost:8085";
        loadFirefoxDriver();
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
    }

    @Test
    public void testAllElementsAreVisible() {
        driver.get(baseUrl + "/lukkarimaatti");
        Assert.assertTrue(driver.findElement(By.className("header")).isDisplayed());
        Assert.assertTrue(driver.findElement(By.id("searchbar")).isDisplayed());
        Assert.assertTrue(driver.findElement(By.id("calendar")).isDisplayed());
        Assert.assertTrue(driver.findElement(By.id("footer")).isDisplayed());
    }

    @Test
    public void testSearchField() {
        driver.get(baseUrl + "/lukkarimaatti");
        driver.findElement(By.id("courseSearchBox")).sendKeys("pattern recognition");
        new WebDriverWait(driver, TIMEOUT)
                .until(ExpectedConditions.visibilityOfElementLocated(By.className("tt-dropdown-menu")));
        driver.findElement(By.id("courseSearchBox")).sendKeys(Keys.ARROW_DOWN, Keys.ENTER);
        Assert.assertTrue(driver.findElement(By.id("BM40A0700")).isDisplayed());
    }

    @Test
    public void testModals() {
        driver.get(baseUrl + "/lukkarimaatti");
        driver.findElement(By.id("aboutModalButton")).click();
        Assert.assertTrue(driver.findElement(By.id("aboutModalButton")).isDisplayed());
        driver.findElement(By.id("aboutClose")).click();
    }

    @After
    public void tearDown() throws Exception {
        driver.quit();
        executorService.shutdown();
    }

    private void loadFirefoxDriver() {
        driver = new FirefoxDriver();
    }

    /**
     * Needs IEDriverServer to be set, see http://code.google.com/p/selenium/wiki/InternetExplorerDriver
     */
    @SuppressWarnings("unused")
    private void loadIEDriver() {
        System.setProperty("webdriver.ie.driver", "C:\\\\dev\\IEDriverServer.exe");
        driver = new InternetExplorerDriver();
        if(driver == null) {
            Assert.fail("InternetExplorerDriver null");
        }
    }

    @SuppressWarnings("unused")
    private void loadChromeDriver() {
        // To remove message "You are using an unsupported command-line flag: --ignore-certificate-errors.
        // Stability and security will suffer."
        // Add an argument 'test-type'
        DesiredCapabilities capabilities = DesiredCapabilities.chrome();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("test-type");
        capabilities.setCapability(ChromeOptions.CAPABILITY, options);
        try {
            driver = new RemoteWebDriver(new URL("http://localhost:8085"), capabilities);
        } catch (Exception e) {
            LOGGER.error("Could not load Chrome driver ", e);
            Assert.fail();
        }
        if(driver == null) {
            Assert.fail("ChromeDriver null");
        }
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);

    }
}
