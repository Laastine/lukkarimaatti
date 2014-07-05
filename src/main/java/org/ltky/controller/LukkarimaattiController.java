package org.ltky.controller;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 8.3.2014
 */
@Controller
@RequestMapping("/")
public class LukkarimaattiController {
    private static final Logger LOGGER = Logger.getLogger(LukkarimaattiController.class);

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getHome(HttpServletRequest request) {
        LOGGER.debug("index hit from "
                +request.getRemoteAddr()+
                "with user-agent"
                +request.getHeader("user-agent"));
        return "redirect:/index.html";
    }


}
