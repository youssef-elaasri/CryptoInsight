package com.cryptoinsight.backend;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.net.http.WebSocket;
import java.util.concurrent.CompletionStage;

public class WebSocketClientTest extends WebSocketClient {

    public WebSocketClientTest(URI serverUri) {
        super(serverUri);
    }

    @Override
    public void onOpen(ServerHandshake handshakedata) {
        System.out.println("WebSocket Connected");
    }

    @Override
    public void onMessage(String message) {
        System.out.println("Message received: " + message);
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        System.out.println("WebSocket Closed");
    }

    @Override
    public void onError(Exception ex) {
        ex.printStackTrace();
    }

    public static void main(String[] args) {
        WebSocketClientTest client = new WebSocketClientTest(URI.create("ws://backend:8080/websocket"));
        client.connect();
    }
}
