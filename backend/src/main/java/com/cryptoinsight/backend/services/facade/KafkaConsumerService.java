package com.cryptoinsight.backend.services.facade;

import com.cryptoinsight.backend.models.Coin;

public interface KafkaConsumerService {

    void consumeMessage(String message);

    void startConsuming();
}
