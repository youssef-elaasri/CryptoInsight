package com.cryptoinsight.backend.services.facade;

import java.util.List;
import java.util.Map;

import com.cryptoinsight.backend.models.Coin;

public interface InfluxDBService {
    void save(Coin coin);

    List<Coin> findByTokenAndTimeRange(String token, String startTime, String endTime);

    public Map<String, Map<String, Double>> getLastTwoPeriods(
            String startTime, String stopTime, String windowPeriod);

    public Map<String, Double> getLastTwoPeriodsForToken(
            String token, String startTime, String stopTime, String windowPeriod);

    List<Coin> getMarketData();
}
