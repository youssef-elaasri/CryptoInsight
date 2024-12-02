package com.cryptoinsight.backend.services.impl;

import com.cryptoinsight.backend.services.facade.KafkaConsumerService;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@Service
public class KafkaConsumerServiceImpl implements KafkaConsumerService {

    private KafkaConsumer<String, String> consumer;

    @Value("${kafka.broker}")
    private String kafkaBroker;

    @Value("${kafka.topic}")
    private String topic;

    // Liste pour stocker les messages consommés
    private final List<String> consumedMessages = new ArrayList<>();

    @Override
    public void startConsuming() {
        if (kafkaBroker == null || topic == null) {
            throw new IllegalArgumentException("Les propriétés kafka.broker et kafka.topic doivent être définies.");
        }

        // Configurer les propriétés du consommateur Kafka
        Properties properties = new Properties();
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaBroker);
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "influx");
        properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        // Initialiser le consommateur
        consumer = new KafkaConsumer<>(properties);

        // S'abonner au topic
        consumer.subscribe(List.of(topic));

        // Lancer la consommation des messages dans un thread séparé
        new Thread(this::consumeMessages).start();
    }

    private void consumeMessages() {
        try {
            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
                if (!records.isEmpty()) {
                    records.forEach(record -> consumeMessage(record.value()));
                } else {
                    System.out.println("Aucun message reçu.");
                }
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de la consommation des messages : " + e.getMessage());
        } finally {
            if (consumer != null) {
                consumer.close();
            }
        }
    }
    

    @Override
    public void consumeMessage(String message) {
        try {
            // Logique de traitement du message
            System.out.println("Message reçu : " + message);
            consumedMessages.add(message);  // Ajouter le message à la liste
        } catch (Exception e) {
            System.err.println("Erreur lors du traitement du message : " + e.getMessage());
        }
    }

    // Méthode pour récupérer les messages consommés
    public List<String> getConsumedMessages() {
        return consumedMessages;
    }
}
