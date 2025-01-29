package com.cryptoinsight.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoinsight.backend.models.Coin;

@RestController
public class HealthController {

    @GetMapping("/")
    public String Default() {
        return "Ok";
    }

    @GetMapping("/health")
    public String Health() {
        return "Health";
    }

    @GetMapping("/ping")
    public String Ping() {
        return "Ping";
    }
}
