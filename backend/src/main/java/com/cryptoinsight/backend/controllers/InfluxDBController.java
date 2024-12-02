package com.cryptoinsight.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cryptoinsight.backend.models.Coin;
import com.cryptoinsight.backend.services.facade.InfluxDBService;
import java.util.List;

@RestController
@RequestMapping("/api/influxdb")
public class InfluxDBController {

    @Autowired
    private InfluxDBService influxDBService;

    @PostMapping("/save")
    public String save(@RequestBody Coin coin) {
        influxDBService.save(coin);
        return "Market data written to InfluxDB";
    }

    @GetMapping("/test")
    public String test() {
        return "Market data written to InfluxDB";
    }

    @GetMapping("/findByTokenAndTimeRange")
    public List<Coin> findByTokenAndTimeRange(
            @RequestParam String token,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        return influxDBService.findByTokenAndTimeRange(token, startTime, endTime);
    }

    @GetMapping("/marketData")
    public List<Coin> getMarketData() {
        return influxDBService.getMarketData();
    }
}
