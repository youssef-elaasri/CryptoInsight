#!/bin/bash

# Names of deployments and services to delete
DEPLOYMENTS=("influxdb-deployment" "kafka" "backend" "dataops" "datastreaming" "frontend")
SERVICES=("influxdb-service" "kafka-service" "frontend-service" "backend-service" "datastreaming-service")

    
 
      


# Delete deployments
echo "Deleting deployments..."
for deployment in "${DEPLOYMENTS[@]}"; do
    echo "Deleting deployment: $deployment"
    kubectl delete deployment "$deployment" --ignore-not-found
done

# Delete services
echo "Deleting services..."
for service in "${SERVICES[@]}"; do
    echo "Deleting service: $service"
    kubectl delete service "$service" --ignore-not-found
done

# Verify cleanup
echo "Checking for remaining resources..."
kubectl get deployments
kubectl get services

echo "Cleanup completed!"
