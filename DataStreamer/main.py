import json
import websocket
import pandas as pd

def on_message(ws, message):
    data = json.loads(message)

    if not 's' in data:
        return

    cleaned = {
        'token': data['s'],
        'start_time': data['k']['t'],
        'end_time': data['k']['T'],
        'open_price': data['k']['o'],
        'close_price': data['k']['c'],
        'highest_price': data['k']['h'],
        'lowest_price': data['k']['l'],
        'volume': data['k']['v'],
        'trades': data['k']['n'],
    }

    print(cleaned)

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print(f"WebSocket connection closed: {close_status_code} - {close_msg}")

def on_open(ws):
    print("WebSocket connection opened")
    subscribe_message = {
        "method": "SUBSCRIBE",
        "params": ["btcusdt@kline_1m"],
        "id": 1
    }
    ws.send(json.dumps(subscribe_message))

def on_ping(ws, message):
    print(f"Received ping: {message}")
    ws.send(message, websocket.ABNF.OPCODE_PONG)
    print(f"Sent pong: {message}")

if __name__ == "__main__":
    websocket.enableTrace(False)
    socket = 'wss://stream.binance.com:443/ws'
    ws = websocket.WebSocketApp(socket,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close,
                                on_open=on_open,
                                on_ping=on_ping)
    ws.run_forever()