package org.ltky;

import org.apache.log4j.Logger;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.resource.ResourceCollection;
import org.ltky.config.WebConfig;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import java.io.IOException;
import java.net.ServerSocket;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 16.12.2014
 */
public class EmbeddedJetty {
    private static final Logger LOGGER = Logger.getLogger(EmbeddedJetty.class);
    public static int PORT = portChecker();
    private static final String CONTEXT_PATH = "/lukkarimaatti";
    private static final String ROOT = "/";
    private static Server server = new Server(PORT);

    public static void main(String[] args) throws Exception {
        Server mainServer = new Server(8080);
        try {
            initServer(mainServer);
            mainServer.start();
            while (true) {
                Thread.sleep(200);
            }
        } catch (Exception e) {
            LOGGER.error("Something terrible happened during jetty startup", e);
        } finally {
            mainServer.stop();
        }
    }

    public static void startJetty() throws Exception {
        initServer(server);
        server.start();
        Thread.sleep(30000);
    }

    public static void stopJetty() throws Exception {
        server.stop();
    }

    private static void initServer(Server server) {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(WebConfig.class);
        ServletContextHandler contextHandler = new ServletContextHandler();
        String[] resources = {"./src/main/webapp/", "./src/test/webapp/"};
        contextHandler.setBaseResource(new ResourceCollection(resources));
        ServletHolder servletHolder = new ServletHolder("dispatcher-servlet", new DispatcherServlet(context));
        servletHolder.setInitOrder(1);
        contextHandler.addServlet(servletHolder, ROOT);
        contextHandler.addEventListener(new ContextLoaderListener(context));
        contextHandler.setContextPath(CONTEXT_PATH);
        server.setHandler(contextHandler);
    }

    public static int portChecker() {
        try {
            ServerSocket socket = new ServerSocket(0);
            int port = socket.getLocalPort();
            socket.close();
            return port;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
