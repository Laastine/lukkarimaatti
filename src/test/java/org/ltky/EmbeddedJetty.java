package org.ltky;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.ltky.config.WebConfig;
import org.apache.log4j.Logger;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 16.12.2014
 */
public class EmbeddedJetty implements Runnable {
    private static final int DEFAULT_PORT = 8080;
    private static final String CONTEXT_PATH = "/lukkarimaatti";
    private static final String MAPPING_URL = "/";
    private static final Logger LOGGER = Logger.getLogger(EmbeddedJetty.class);

    public static void main(String[] args) throws Exception {
        new EmbeddedJetty().startJetty();
    }

    private void startJetty() {
        try {
            Server server = new Server(DEFAULT_PORT);
            server.setHandler(getServletContextHandler(getContext()));
            server.start();
            server.join();
        } catch (Exception e) {
            throw new RuntimeException("Jettyrunner failed ", e);
        }
    }

    private static ServletContextHandler getServletContextHandler(AnnotationConfigWebApplicationContext context) {
        ServletContextHandler contextHandler = new ServletContextHandler();
        contextHandler.setResourceBase("./src/main/webapp/");
        ServletHolder servletHolder = new ServletHolder("dispatcher-servlet", new DispatcherServlet(context));
        servletHolder.setInitOrder(1);
        contextHandler.addServlet(servletHolder, MAPPING_URL);
        contextHandler.addEventListener(new ContextLoaderListener(context));
        contextHandler.setContextPath(CONTEXT_PATH);
        return contextHandler;
    }

    private static AnnotationConfigWebApplicationContext getContext() {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(WebConfig.class);
        return context;
    }

    @Override
    public void run() {
        try {
            new EmbeddedJetty().startJetty();
        } catch (Exception e) {
            LOGGER.error("Jetty error=", e);
        }
    }
}
