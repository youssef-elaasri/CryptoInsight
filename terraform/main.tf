terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.8.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0.1"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Get Google credentials - this needs to be before the kubernetes provider
data "google_client_config" "default" {}

resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}

resource "google_container_cluster" "primary" {
  name                = "crypto-insights-cluster"
  location            = var.region
  initial_node_count  = 1
  deletion_protection = false

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  node_config {
    machine_type = "e2-standard-2"
    disk_size_gb = 50
    oauth_scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  network = google_compute_network.vpc_network.name
}

# Configure kubernetes provider with cluster access
provider "kubernetes" {
  host                   = "https://${google_container_cluster.primary.endpoint}"
  cluster_ca_certificate = base64decode(google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
  token                  = data.google_client_config.default.access_token

  # Add these lines for better authentication handling
  client_certificate = base64decode(google_container_cluster.primary.master_auth[0].client_certificate)
  client_key         = base64decode(google_container_cluster.primary.master_auth[0].client_key)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "gcloud"
    args = [
      "container",
      "clusters",
      "get-credentials",
      google_container_cluster.primary.name,
      "--region",
      var.region,
      "--project",
      var.project_id
    ]
  }
}


