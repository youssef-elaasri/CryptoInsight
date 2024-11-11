# Kubernetes Setup Guide

This document provides the necessary commands to deploy the resources in the Kubernetes cluster using the YAML configurations provided in the project directory.

## Prerequisites

Ensure you have the following tools installed:

- `kubectl` (Kubernetes CLI)
- A running Kubernetes cluster (local, cloud, or managed service)
- Your Kubernetes context configured to point to the appropriate cluster

## Create Docker Images using Docker-compose

```bash
docker-compose build
```

## Creating App Deployments

### Influxdb

```bash
kubectl apply -f database/influxdb-ressources.yaml
```

### Kafka

```bash
kubectl apply -f database/kafka-ressources.yaml
```

### Backend

```bash
kubectl apply -f backend/backend-ressources.yaml
```

### Frontend

```bash
kubectl apply -f frontend/frontend-ressources.yaml
```

### Dataops

```bash
kubectl apply -f dataops/dataops-ressources.yaml
```

### dataStreamer

```bash
kubectl apply -f dataStreamer/datastreamer-ressources.yaml
```

## Creating Cluster Roles and Role Bindings

### 1. Cluster Role and role bindings for Kube-State-Metrics

To create the necessary cluster role for `kube-state-metrics`, run the following command:

```bash
kubectl apply -f sre/cluster-role-kube-state-metrics.yaml
```

### 2. Cluster Role and Role bindings for Prometheus

To create the necessary cluster role for `prometheus`, run the following command:

```bash
kubectl apply -f sre/cluster-role-prometheus.yaml
```

## Creating Service Accounts

To create the service account for the `monitoring-stack` (Grafana and Prometheus), run the following command:

```bash
kubectl apply -f sre/service-account.yaml
```

This will create the service account required by the deployment to access the Kubernetes resources.

## Creating ConfigMaps

### 1. Prometheus ConfigMap

To create the ConfigMap for Prometheus, use the following command:

```bash
kubectl apply -f sre/config-map.yaml
```

This will configure Prometheus with the necessary scrape configurations and other settings.

### 2. Grafana Datasource ConfigMap

To create the ConfigMap for Grafana datasources, run the following:

```bash
kubectl apply -f sre/grafana-datasource-config.yaml
```

This will allow Grafana to connect to Prometheus and other data sources based on your configurations.

## Creating Deployments

### 1. Monitoring Stack Deployment (Grafana, Prometheus, Kube-State-Metrics)

To deploy the `monitoring-stack` (which includes Grafana, Prometheus, and Kube-State-Metrics), use:

```bash
kubectl apply -f sre/sre-ressources.yaml
```

This command will create the necessary deployments and services for Prometheus, Grafana, and Kube-State-Metrics.

## Accessing Grafana and Prometheus

- Grafana: You can access Grafana via `http://<node-ip>:32000` (the NodePort specified in the `grafana-service.yaml`). (If working locally localhost:32000)
- Prometheus: You can access Prometheus via `http://<node-ip>:30000` (the NodePort specified in the `prometheus-service.yaml`). (If working locally localhost:30000)
