package com.cryptoinsight.backend.repositories.impl;

import com.cryptoinsight.backend.repositories.facade.MciRepository;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class MciRepositoryImpl implements MciRepository {

    @Autowired
    private InfluxDBClient influxDBClient;

    @Value("${influxdb.bucket}")
    private String bucket;


    @Override
    public List<Map<String, Object>> getMci(String token) {

        String fluxQuery = String.format(
            "mean_table = from(bucket: \"%s\") " +
            "|> range(start: time(v: \"2000-01-01T00:00:00Z\"), stop: time(v: \"2100-01-01T00:00:00Z\")) " +
            "|> filter(fn: (r) => r[\"_measurement\"] == \"market_data\") " +
            "|> filter(fn: (r) => r[\"_field\"] == \"close_price\") " +
            "|> filter(fn: (r) => r[\"token\"] == \"%s\") " +
            "|> window(every: 2m) " +
            "|> mean(column: \"_value\") " +
            "|> map(fn: (r) => ({ _start: r._start, _stop: r._stop, mean_value: float(v: r._value), join_key: \"constant\" })) " +
            "|> keep(columns: [\"_start\", \"_stop\", \"mean_value\", \"join_key\"]) " +

            "\n" +

            "sum_table = from(bucket: \"%s\") " +
            "|> range(start: time(v: \"2000-01-01T00:00:00Z\"), stop: time(v: \"2100-01-01T00:00:00Z\")) " +
            "|> filter(fn: (r) => r[\"_measurement\"] == \"market_data\") " +
            "|> filter(fn: (r) => r[\"_field\"] == \"volume\") " +
            "|> filter(fn: (r) => r[\"token\"] == \"%s\") " +
            "|> window(every: 2m) " +
            "|> sum(column: \"_value\") " +
            "|> map(fn: (r) => ({ _start: r._start, _stop: r._stop, sum_volume: float(v: r._value) })) " +
            "|> keep(columns: [\"_start\", \"_stop\", \"sum_volume\"]) " +

            "\n" +

            "original_table = from(bucket: \"%s\") " +
            "|> range(start: time(v: \"2000-01-01T00:00:00Z\"), stop: time(v: \"2100-01-01T00:00:00Z\")) " +
            "|> filter(fn: (r) => r[\"_measurement\"] == \"market_data\") " +
            "|> filter(fn: (r) => r[\"_field\"] == \"close_price\") " +
            "|> filter(fn: (r) => r[\"token\"] == \"%s\") " +
            "|> map(fn: (r) => ({ _time: r._time, _value: float(v: r._value), join_key: \"constant\" })) " +

            "\n" +

            "mean_volatility_table = join(tables: {original: original_table, mean: mean_table}, on: [\"join_key\"]) " +
            "|> filter(fn: (r) => r._time >= r._start and r._time < r._stop) " +
            "|> map(fn: (r) => ({ _start: r._start, _stop: r._stop, _time: r._time, _value: r._value, mean_value: r.mean_value, " +
            "volatility: float(v: (r._value - r.mean_value) ^ 2.0) })) " +
            "|> window(every: 2m) " +
            "|> mean(column: \"volatility\") " +
            "|> map(fn: (r) => ({ _start: r._start, _stop: r._stop, mean_volatility: r.volatility, " +
            "sqrt_volatility: r.volatility ^ 0.5 })) " +

            "\n" +

            "result = join(tables: {volatility: mean_volatility_table, sum: sum_table}, on: [\"_start\", \"_stop\"]) " +
            "|> map(fn: (r) => ({ _start: r._start, _stop: r._stop, mean_volatility: r.mean_volatility, " +
            "sqrt_volatility: r.sqrt_volatility, sum_volume: r.sum_volume, " +
            "ratio: if r.sqrt_volatility != 0.0 then r.sqrt_volatility / r.sum_volume else 0.0 })) " +
            "|> yield(name: \"final_result\")",
            bucket, token, bucket, token, bucket, token
        );


        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);


        List<Map<String, Object>> results = new ArrayList<>();

        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                Map<String, Object> row = new LinkedHashMap<>();
                
                row.put("_start", record.getValueByKey("_start"));
                row.put("_stop", record.getValueByKey("_stop"));
                row.put("mean_volatility", record.getValueByKey("mean_volatility"));
                row.put("sqrt_volatility", record.getValueByKey("sqrt_volatility"));
                row.put("sum_volume", record.getValueByKey("sum_volume"));
                row.put("ratio", record.getValueByKey("ratio"));
                row.put("_time", record.getTime() != null ? record.getTime().toString() : null); 
                
                results.add(row);
            }
        }

        return results;
    }

}