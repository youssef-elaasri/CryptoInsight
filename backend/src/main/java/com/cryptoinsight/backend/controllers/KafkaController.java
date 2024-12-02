package com.cryptoinsight.backend.controllers;

import com.cryptoinsight.backend.services.impl.KafkaConsumerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;


import com.cryptoinsight.backend.services.facade.KafkaConsumerService;
import java.util.List;

@RestController
@RequestMapping("/api")
public class KafkaController {

    @Autowired
    private KafkaConsumerService kafkaConsumerService;
    

    // Endpoint pour récupérer les messages consommés
    @GetMapping("/messages")
    public List<String> getMessages() {
        return kafkaConsumerService.getConsumedMessages();
    }
}
