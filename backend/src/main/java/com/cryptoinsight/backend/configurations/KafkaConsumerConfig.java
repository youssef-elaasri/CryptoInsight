package com.cryptoinsight.backend.configurations;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public Properties kafkaConsumerProperties() {
        String kafkaBroker = System.getenv("KAFKA_BROKER");
        if (kafkaBroker == null) {
            throw new IllegalArgumentException("La variable d'environnement KAFKA_BROKER doit être définie.");
        }

        Properties properties = new Properties();
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaBroker);
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "influx");
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        return properties;
    }
}
