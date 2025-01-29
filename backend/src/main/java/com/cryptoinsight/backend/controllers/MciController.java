package com.cryptoinsight.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cryptoinsight.backend.services.facade.MciService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/")
public class MciController {

    @Autowired
    private MciService mciService;

    @GetMapping("/mci")
    public List<Map<String, Object>> getMci(@RequestParam String token) {

        List<Map<String, Object>> mci = mciService.getMci(token);

        return mci;
    }
}