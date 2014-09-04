package org.ltky.controller;

import org.apache.log4j.Logger;
import org.ltky.model.JsonResponse;
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
        return "redirect:/app/dist/index.html";
    }

    @RequestMapping(value = "app/save",
            method = RequestMethod.POST,
            produces = "application/json")
    @ResponseBody
    public JsonResponse saveCourseData(@RequestParam(value = "email") String email) {
        LOGGER.info("Save data with email=" + email);
        return new JsonResponse("OK", "200");
    }
}
