package com.cryptoinsight.backend.services.facade;

import java.util.List;

import com.cryptoinsight.backend.models.Coin;

public interface InfluxDBService {
    void save(Coin coin);

    List<Coin> findByTokenAndTimeRange(String token, String startTime, String endTime);
}
