package com.cryptoinsight.backend.configurations;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.InfluxDBClientOptions;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class InfluxDBConfig {

    @Value("${influxdb.url}")
    private String url;

    @Value("${influxdb.token}")
    private String token;

    @Value("${influxdb.bucket}")
    private String bucket;

    @Value("${influxdb.org}")
    private String org;

    @Bean
    public InfluxDBClient influxDBClient() {
        // Create an OkHttpClient.Builder (not OkHttpClient directly)
        OkHttpClient.Builder okHttpClientBuilder = new OkHttpClient.Builder()
                .connectTimeout(1800, TimeUnit.SECONDS) // Increase connection timeout
                .readTimeout(1800, TimeUnit.SECONDS) // Increase read timeout
                .writeTimeout(1800, TimeUnit.SECONDS) // Increase write timeout
                .retryOnConnectionFailure(true); // Enable retry on failure

        InfluxDBClientOptions options = InfluxDBClientOptions.builder()
                .url(url)
                .authenticateToken(token.toCharArray())
                .org(org)
                .bucket(bucket)
                .okHttpClient(okHttpClientBuilder) // Pass the builder, not the client
                .build();

        return InfluxDBClientFactory.create(options);
    }
}
