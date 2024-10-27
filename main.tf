terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

variable "project_id" {
  description = "The ID of the project in Google Cloud"
  type        = string
}

provider "google" {
  project = var.project_id
}

resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}

