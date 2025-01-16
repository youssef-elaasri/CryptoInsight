package com.cryptoinsight.backend.repositories.facade;

import com.cryptoinsight.backend.models.Coin;
import com.influxdb.query.FluxTable;

import java.util.List;

public interface InfluxRepository {
    void save(Coin coin);

    List<FluxTable> findByTokenAndTimeRange(String token, String startTime, String endTime);

    public List<FluxTable> getLastTwoPeriods(String startTime, String stopTime, String windowPeriod);

    public List<FluxTable> getLastTwoPeriodsPrice(String startTime, String stopTime, String windowPeriod);

    List<FluxTable> getLastTwoPeriodsForToken(String token, String startTime, String stopTime,
            String windowPeriod);

    public List<FluxTable> getLastTwoPeriodsPriceForToken(String token, String startTime, String stopTime,
            String windowPeriod);

    List<FluxTable> getAllMarketData();
}
