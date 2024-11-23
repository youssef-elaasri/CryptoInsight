#!/bin/bash

# Paths to the YAML files
YAML_FILES=(
    "./database/kafka-ressources.yaml"
    "./database/influxdb-ressources.yaml"
    "./backend/backend-ressources.yaml"
    # uncomment the following lines to deploy the frontend, dataops, and datastreamer once they are ready
    # "./frontend/frontend-ressources.yaml"
    # "./dataops/dataops-ressources.yaml"
    # "./dataStreamer/datastreamer-ressources.yaml"
)

# Apply YAML files
echo "Applying configurations..."
for file in "${YAML_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "Applying: $file"
        kubectl apply -f "$file"
    else
        echo "File not found: $file"
    fi
done

# Verify resources
echo "Current deployments:"
kubectl get deployments

echo "Current services:"
kubectl get services

echo "Setup completed!"
