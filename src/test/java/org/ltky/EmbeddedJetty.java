package org.ltky;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.ltky.config.WebConfig;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import java.io.IOException;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 16.12.2014
 */
public class EmbeddedJetty {

    private static final int DEFAULT_PORT = 8085;
    private static final String CONTEXT_PATH = "/lukkarimaatti";
    private static final String CONFIG_LOCATION = "org.ltky.config";
    private static final String MAPPING_URL = "/";
    private static final String DEFAULT_PROFILE = "dev";

    public static void main(String[] args) throws Exception {
        new EmbeddedJetty().startJetty(getPortFromArgs(args));
    }

    private static int getPortFromArgs(String[] args) {
        if (args.length > 0) {
            try {
                return Integer.valueOf(args[0]);
            } catch (NumberFormatException ignore) {
            }
        }
        return DEFAULT_PORT;
    }

    private void startJetty(int port) throws Exception {
        Server server = new Server(port);
        server.setHandler(getServletContextHandler(getContext()));
        server.start();
        server.join();
    }

    private static ServletContextHandler getServletContextHandler(AnnotationConfigWebApplicationContext context) throws IOException {
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
        //context.getEnvironment().setDefaultProfiles(DEFAULT_PROFILE);
        return context;
    }

}
