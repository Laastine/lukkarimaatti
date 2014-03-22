package org.ltky.controller;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 8.3.2014
 */
@Controller
public class LukkarimaattiController {
    private static Logger LOGGER = Logger.getLogger(LukkarimaattiController.class);

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getHome() {
        LOGGER.debug("index.html HIT");
        return "redirect:/static/index.html";
    }
}
