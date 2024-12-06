from kafka import KafkaConsumer
import os
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
import json
from prometheus_client import start_http_server, Gauge
import time
import logging
from prometheus_client import Histogram


# Kafka broker address and topic
KAFKA_BROKER = os.getenv("KAFKA_BROKER")
TOPIC = os.getenv("TOPIC")
# Expose metric for prometheus to scrape
data_pipeline_latency = Histogram('data_pipeline_latency_seconds', 'Latency in seconds from receiving data to saving in DB')
# InfluxDB connection details
INFLUXDB_URL = "http://influxdb:8086"
INFLUXDB_TOKEN = os.getenv("DOCKER_INFLUXDB_INIT_ADMIN_TOKEN")
INFLUXDB_ORG = os.getenv("DOCKER_INFLUXDB_INIT_ORG")
INFLUXDB_BUCKET = os.getenv("DOCKER_INFLUXDB_INIT_BUCKET")

def create_consumer():
    # Create a Kafka consumer
    consumer = KafkaConsumer(
        TOPIC,
        bootstrap_servers = KAFKA_BROKER,
        auto_offset_reset = 'earliest',
        enable_auto_commit = True,
        group_id = 'influx',
        value_deserializer = lambda x: x.decode('utf-8')
    )
    print("Kafka consumer created successfully",flush=True)
    return consumer

def save_to_influx(write_api, data):
    # Create an InfluxDB point with fields and tags from the cleaned data
    point = Point("market_data") \
        .tag("token", data['token']) \
        .field("end_time", data['end_time']) \
        .field("open_price", float(data['open_price'])) \
        .field("close_price", float(data['close_price'])) \
        .field("highest_price", float(data['highest_price'])) \
        .field("lowest_price", float(data['lowest_price'])) \
        .field("volume", float(data['volume'])) \
        .field("trades", int(data['trades'])) \
        .time(data['start_time'])
    print(f"Data saved to InfluxDB: {data}",flush=True)
    # Write the point to InfluxDB
    write_api.write(bucket=INFLUXDB_BUCKET, record=point)

def main():
    consumer = create_consumer()
    client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)
    print("Connected to InfluxDB",flush=True)
    write_api = client.write_api(write_options=SYNCHRONOUS)
    while True:
        for message in consumer:
            try:
                converted = json.loads(message.value.replace("\'", "\""))
                # get timestamp to measure latency
                start_time=converted["timestamp"]
                current_time=time.time()
                latency=current_time-start_time
                print(f"Consumed message: {converted}, Latency: {latency:.3f}s",flush=True)
                data_pipeline_latency.observe(latency)
                save_to_influx(write_api, converted)
            except Exception as e:
                print(f"Error processing message: {e}", flush=True)

if __name__ == "__main__":
    start_http_server(8080)
    print("Prometheus HTTP server started on port 8080",flush=True)
    main()