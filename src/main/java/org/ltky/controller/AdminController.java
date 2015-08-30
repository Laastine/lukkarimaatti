package org.ltky.controller;

import org.apache.log4j.Logger;
import org.ltky.parser.ParserConfiguration;
import org.ltky.task.TaskConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by laastine on 30/08/15.
 */
@Controller
@RequestMapping("/admin")
public class AdminController {
    private final ParserConfiguration parserConfiguration;
    private static final Logger LOGGER = Logger.getLogger(LukkarimaattiController.class);

    public AdminController() {
        parserConfiguration = ParserConfiguration.getInstance();
    }

    @Autowired
    TaskConfigurer taskConfigurer;

    @RequestMapping(value = "update",
            method = RequestMethod.POST,
            produces = "application/json")
    public ResponseEntity<String> updateDBData(HttpServletRequest request,
                                               @RequestParam(value = "secret", required = true) String secret) {
        if (secret.equals(parserConfiguration.getAdminPassword())) {
            LOGGER.info("Update course data manually. Request from "
                    + request.getRemoteAddr()
                    + " with user-agent"
                    + request.getHeader("user-agent"));
            new Thread(() -> taskConfigurer.updateCourseDataManually()).start();
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            LOGGER.info("updateDBData authentication error. Request from "
                    + request.getRemoteAddr()
                    + " with user-agent"
                    + request.getHeader("user-agent"));
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
