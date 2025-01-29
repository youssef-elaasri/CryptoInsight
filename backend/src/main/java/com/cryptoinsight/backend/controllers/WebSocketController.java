package com.cryptoinsight.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate template;

    // Méthode pour envoyer un message à un canal WebSocket
    public void sendToFrontend(String message) {
        template.convertAndSend("/topic/messages", message);
        System.out.println("Message envoyer au frontend : " + message);

    }

    @GetMapping("/sendMessage")
    public String sendTestMessage() {
        String message = "Hello from server!";
        template.convertAndSend("/topic/messages", message);
        return "Message sent: " + message;
    }

  
}

