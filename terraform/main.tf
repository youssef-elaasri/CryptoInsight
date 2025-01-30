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
  backend "gcs" {
    bucket = "cryptoinsight-terraform-states"
    prefix = "terraform/state"
  }

}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Enable required APIs
resource "google_project_service" "artifact_registry" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}


# Create Artifact Registry Repository
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.region
  repository_id = "cryptoinsight-docker"
  description   = "Docker repository for CryptoInsight application"
  format        = "DOCKER"
  depends_on    = [google_project_service.artifact_registry]
}
# Docker authentication
resource "null_resource" "auth_docker" {
  provisioner "local-exec" {
    command = "gcloud auth configure-docker ${var.region}-docker.pkg.dev"
  }
  depends_on = [google_artifact_registry_repository.docker_repo]
}

# Build all images using docker-compose
resource "null_resource" "build_images" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = <<EOF
      cd ${path.module}/.. && \
      docker-compose build
    EOF
  }
  depends_on = [null_resource.auth_docker]
}

# Push all images using docker-compose
resource "null_resource" "push_images" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = <<EOF
      cd ${path.module}/.. && \
      docker-compose push
    EOF
  }
  depends_on = [null_resource.build_images]
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
  enable_autopilot = true

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
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

