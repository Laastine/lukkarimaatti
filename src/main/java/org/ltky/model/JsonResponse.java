package org.ltky.model;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 10.7.2014
 */
public class JsonResponse {

    private String status = "";
    private String errorMessage = "";

    public JsonResponse(String status, String errorMessage) {
        this.status = status;
        this.errorMessage = errorMessage;
    }
}
