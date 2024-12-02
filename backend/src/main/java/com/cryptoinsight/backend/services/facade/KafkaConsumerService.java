package com.cryptoinsight.backend.services.facade;

import com.cryptoinsight.backend.models.Coin;
import java.util.List;


public interface KafkaConsumerService {

   /* void consumeMessage(String message);

    void startConsuming();
    List<String> getConsumedMessages();*/
    void consume(String message);
}