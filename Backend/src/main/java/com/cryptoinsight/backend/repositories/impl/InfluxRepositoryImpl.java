package com.cryptoinsight.backend.repositories.impl;

import com.cryptoinsight.backend.models.Coin;
import com.cryptoinsight.backend.repositories.facade.InfluxRepository;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.QueryApi;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxTable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InfluxRepositoryImpl implements InfluxRepository {

        @Autowired
        private InfluxDBClient influxDBClient;

        @Value("${influxdb.bucket}")
        private String bucket;

        @Override
        public void save(Coin coin) {
                WriteApiBlocking writeApi = influxDBClient.getWriteApiBlocking();

                Point point = Point.measurement("market_data")
                                .addTag("token", coin.getToken())
                                .addField("end_time",
                                                coin.getEndTime().getEpochSecond() * 1_000_000_000L
                                                                + coin.getEndTime().getNano())
                                .addField("open_price", coin.getOpenPrice())
                                .addField("close_price", coin.getClosePrice())
                                .addField("highest_price", coin.getHighestPrice())
                                .addField("lowest_price", coin.getLowestPrice())
                                .addField("volume", coin.getVolume())
                                .addField("trades", coin.getTrades())
                                .time(coin.getStartTime(), WritePrecision.MS);

                writeApi.writePoint(point);
        }

        @Override
        public List<FluxTable> findByTokenAndTimeRange(String token, String startTime, String endTime) {
                String fluxQuery = String.format(
                                "from(bucket: \"%s\") " +
                                                "|> range(start: time(v: \"%s\"), stop: time(v: \"%s\")) " +
                                                "|> filter(fn: (r) => r[\"_measurement\"] == \"market_data\") " +
                                                "|> filter(fn: (r) => r[\"token\"] == \"%s\") " +
                                                "|> pivot(rowKey: [\"_time\"], columnKey: [\"_field\"], valueColumn: \"_value\")",
                                bucket, startTime, endTime, token);
                QueryApi queryApi = influxDBClient.getQueryApi();
                return queryApi.query(fluxQuery);
        }

}
