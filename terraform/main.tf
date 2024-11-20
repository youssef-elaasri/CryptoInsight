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

resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}

resource "google_container_cluster" "primary" {
  name     = "crypto-insights-cluster"
  location = var.region

  initial_node_count        = 1
  deletion_protection       = false


}