#!/bin/bash

# Delete all deployments in the current namespace
echo "Deleting all deployments..."
kubectl delete deployments --all

# Delete InfluxDB and Kafka services
echo "Deleting InfluxDB service..."
kubectl delete service influxdb-service

echo "Deleting Kafka service..."
kubectl delete service kafka-service

# Apply the resources for InfluxDB and Kafka
echo "Applying InfluxDB resources..."
kubectl apply -f influxdb-ressources.yaml

echo "Applying Kafka resources..."
kubectl apply -f kafka-ressources.yaml

echo "Deployment and service operations completed successfully."
