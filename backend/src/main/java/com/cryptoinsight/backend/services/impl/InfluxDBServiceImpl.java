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
import java.util.HashMap;
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

    public Map<String, Map<String, Double>> getLastTwoPeriods(
            String startTime, String stopTime, String windowPeriod) {

        // Retrieve data for trades and volume
        List<FluxTable> tables = influxRepository.getLastTwoPeriods(startTime, stopTime, windowPeriod);

        // Retrieve data for close price
        List<FluxTable> priceTables = influxRepository.getLastTwoPeriodsPrice(startTime, stopTime, windowPeriod);

        // Initialize dictionaries to store results
        Map<String, Map<String, Double>> tokenData = new HashMap<>();
        Map<String, Map<String, String>> earliestTimeMap = new HashMap<>();

        // Process trades and volume
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                String token = (String) record.getValueByKey("token");
                String field = (String) record.getValueByKey("_field"); // "trades" or "volume"
                Double value = record.getValueByKey("_value") != null
                        ? ((Number) record.getValueByKey("_value")).doubleValue()
                        : 0.0;
                String time = record.getTime().toString();

                // Ensure token entry exists in both maps
                tokenData.putIfAbsent(token, new HashMap<>());
                earliestTimeMap.putIfAbsent(token, new HashMap<>());

                // Check if this is the earliest time for the current field
                if (!earliestTimeMap.get(token).containsKey(field) ||
                        time.compareTo(earliestTimeMap.get(token).get(field)) < 0) {
                    earliestTimeMap.get(token).put(field, time);
                    tokenData.get(token).put(field, value);
                }
            }
        }

        // Process close price
        for (FluxTable table : priceTables) {
            for (FluxRecord record : table.getRecords()) {
                String token = (String) record.getValueByKey("token");
                String field = "close_price"; // Fixed field name for close price
                Double value = record.getValueByKey("_value") != null
                        ? ((Number) record.getValueByKey("_value")).doubleValue()
                        : 0.0;
                String time = record.getTime().toString();

                // Ensure token entry exists in both maps
                tokenData.putIfAbsent(token, new HashMap<>());
                earliestTimeMap.putIfAbsent(token, new HashMap<>());

                // Check if this is the earliest time for the close price
                if (!earliestTimeMap.get(token).containsKey(field) ||
                        time.compareTo(earliestTimeMap.get(token).get(field)) < 0) {
                    earliestTimeMap.get(token).put(field, time);
                    tokenData.get(token).put(field, value);
                }
            }
        }

        return tokenData;
    }

    public Map<String, Double> getLastTwoPeriodsForToken(
            String token, String startTime, String stopTime, String windowPeriod) {

        // Retrieve data for trades and volume for the specific token
        List<FluxTable> tables = influxRepository.getLastTwoPeriodsForToken(token, startTime, stopTime, windowPeriod);

        // Retrieve data for close price for the specific token
        List<FluxTable> priceTables = influxRepository.getLastTwoPeriodsPriceForToken(token, startTime, stopTime,
                windowPeriod);

        // Initialize dictionaries to store results
        Map<String, Double> tokenData = new HashMap<>();
        Map<String, String> earliestTimeMap = new HashMap<>();

        // Process trades and volume
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                String field = (String) record.getValueByKey("_field"); // "trades" or "volume"
                Double value = record.getValueByKey("_value") != null
                        ? ((Number) record.getValueByKey("_value")).doubleValue()
                        : 0.0;
                String time = record.getTime().toString();

                // Ensure entry exists for the field in earliestTimeMap
                earliestTimeMap.putIfAbsent(field, "");

                // Check if this is the earliest time for the current field
                if (earliestTimeMap.get(field).isEmpty() ||
                        time.compareTo(earliestTimeMap.get(field)) < 0) {
                    earliestTimeMap.put(field, time);
                    tokenData.put(field, value);
                }
            }
        }

        // Process close price
        for (FluxTable table : priceTables) {
            for (FluxRecord record : table.getRecords()) {
                String field = "close_price"; // Fixed field name for close price
                Double value = record.getValueByKey("_value") != null
                        ? ((Number) record.getValueByKey("_value")).doubleValue()
                        : 0.0;
                String time = record.getTime().toString();

                // Ensure entry exists for the field in earliestTimeMap
                earliestTimeMap.putIfAbsent(field, "");

                // Check if this is the earliest time for the close price
                if (earliestTimeMap.get(field).isEmpty() ||
                        time.compareTo(earliestTimeMap.get(field)) < 0) {
                    earliestTimeMap.put(field, time);
                    tokenData.put(field, value);
                }
            }
        }

        return tokenData;
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
