package com.cryptoinsight.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/external")
public class ExternalApiController {

    private final RestTemplate restTemplate;

    @Autowired
    public ExternalApiController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping
    public ResponseEntity<Object> getGlobalData() {

        String apiUrl = "https://api.alternative.me/v2/global/";

        ResponseEntity<Object> response = restTemplate.getForEntity(apiUrl, Object.class);

        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}
