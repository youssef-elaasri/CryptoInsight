package com.cryptoinsight.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cryptoinsight.backend.models.Coin;
import com.cryptoinsight.backend.services.facade.InfluxDBService;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/getLastTwoPeriods")
    public Map<String, Map<String, Double>> getLastTwoPeriods(@RequestParam String startTime,
            @RequestParam String stopTime, @RequestParam String windowPeriod) {
        return influxDBService.getLastTwoPeriods(startTime, stopTime, windowPeriod);
    }

    @GetMapping("/getLastTwoPeriodsForToken")
    public Map<String, Double> getLastTwoPeriodsForToken(@RequestParam String token,
            @RequestParam String startTime,
            @RequestParam String stopTime, @RequestParam String windowPeriod) {
        return influxDBService.getLastTwoPeriodsForToken(token, startTime, stopTime, windowPeriod);
    }

    @GetMapping("/marketData")
    public List<Coin> getMarketData() {
        return influxDBService.getMarketData();
    }
}
