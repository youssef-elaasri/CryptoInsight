package com.cryptoinsight.backend.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cryptoinsight.backend.models.Coin;
import com.cryptoinsight.backend.repositories.facade.InfluxRepository;
import com.cryptoinsight.backend.services.facade.InfluxDBService;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class InfluxDBServiceImpl implements InfluxDBService {

    @Autowired
    private InfluxRepository influxRepository;

    @Override
    public void save(Coin coin) {
        influxRepository.save(coin);
    }

    @Override
    public List<Coin> findByTokenAndTimeRange(String token, String startTime, String endTime) {
        List<FluxTable> results = influxRepository.findByTokenAndTimeRange(token, startTime, endTime);
        List<Coin> coins = new ArrayList<>();
        for (FluxTable fluxTable : results) {
            for (FluxRecord record : fluxTable.getRecords()) {
                Map<String, Object> values = record.getValues();

                Coin coin = new Coin();
                coin.setToken((String) values.get("token"));
                // transform nanoseconds to instant
                long nanoTime = (Long) values.get("end_time");
                long seconds = nanoTime / 1_000_000_000L;
                int nanos = (int) (nanoTime % 1_000_000_000L);
                Instant instant = Instant.ofEpochSecond(seconds, nanos);
                coin.setEndTime(instant);
                coin.setOpenPrice((Double) values.get("open_price"));
                coin.setClosePrice((Double) values.get("close_price"));
                coin.setHighestPrice((Double) values.get("highest_price"));
                coin.setLowestPrice((Double) values.get("lowest_price"));
                coin.setVolume((Double) values.get("volume"));
                coin.setTrades(((Long) values.get("trades")).intValue());
                coin.setStartTime((Instant) values.get("_time"));

                coins.add(coin);
            }
        }
        return coins;
    }

    @Override
    public List<Coin> getMarketData() {
        // Effectuer une requête Flux pour récupérer toutes les données
        List<FluxTable> results = influxRepository.getAllMarketData();
        List<Coin> coins = new ArrayList<>();

        if (results.isEmpty()) {
            return coins; // Retourner une liste vide si aucune donnée n'est trouvée
        }

        // Parcourir les résultats de la requête
        for (FluxTable fluxTable : results) {
            for (FluxRecord record : fluxTable.getRecords()) {
                Map<String, Object> values = record.getValues();

                Coin coin = new Coin();
                coin.setToken((String) values.get("token"));
                
                // Convertir les nanosecondes en Instant
                long nanoTime = (Long) values.get("end_time");
                long seconds = nanoTime / 1_000_000_000L;
                int nanos = (int) (nanoTime % 1_000_000_000L);
                Instant instant = Instant.ofEpochSecond(seconds, nanos);
                coin.setEndTime(instant);
                
                coin.setOpenPrice((Double) values.get("open_price"));
                coin.setClosePrice((Double) values.get("close_price"));
                coin.setHighestPrice((Double) values.get("highest_price"));
                coin.setLowestPrice((Double) values.get("lowest_price"));
                coin.setVolume((Double) values.get("volume"));
                coin.setTrades(((Long) values.get("trades")).intValue());
                coin.setStartTime((Instant) values.get("_time"));

                coins.add(coin);
            }
        }
        
        return coins; // Retourner la liste des coins
    }

    
}
