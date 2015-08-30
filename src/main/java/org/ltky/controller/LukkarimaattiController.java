package org.ltky.controller;

import org.apache.log4j.Logger;
import org.ltky.util.EmailLink;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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

    @RequestMapping(value = "/",
            method = RequestMethod.GET)
    public String getHome(HttpServletRequest request) {
        LOGGER.info("index hit from "
                + request.getRemoteAddr() +
                " with user-agent"
                + request.getHeader("user-agent"));
        return "index.html";
    }

    @RequestMapping(value = "save",
            method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public ResponseEntity<String> saveCourseData(
            HttpServletRequest request,
            @RequestParam(value = "email", required = true) String toAddress,
            @RequestParam(value = "link", required = true) String link) {
        LOGGER.info("Save data with email from "
                + request.getRemoteAddr()
                + " with user-agent"
                + request.getHeader("user-agent"));
        new EmailLink().buildMail(toAddress, link);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
