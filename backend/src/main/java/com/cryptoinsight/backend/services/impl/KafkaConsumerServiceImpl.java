package com.cryptoinsight.backend.services.impl;

import com.cryptoinsight.backend.controllers.WebSocketController;
import com.cryptoinsight.backend.services.facade.KafkaConsumerService;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@Service
public class KafkaConsumerServiceImpl implements KafkaConsumerService {

    private final List<String> consumedMessages = new ArrayList<>();

    @Autowired
    private WebSocketController webSocketController;

    @KafkaListener(topics = "${spring.kafka.topic}", groupId = "${spring.kafka.consumer.group-id}")

    public void consume(String message) {
        System.out.println("Message reçu du topic Kafka : " + message);
        try {
            // Logique de traitement du message
            System.out.println("Message reçu : " + message);
            consumedMessages.add(message);  // Ajouter le message à la liste

            // envoyez le message via WebSocket
            webSocketController.sendToFrontend(message);


        } catch (Exception e) {
            System.err.println("Erreur lors du traitement du message : " + e.getMessage());
        }
        // Traitez le message ici
        // Par exemple, stockez-le dans une base de données ou effectuez d'autres traitements
    }
    
    public List<String> getConsumedMessages() {
        return consumedMessages;
    }
}
