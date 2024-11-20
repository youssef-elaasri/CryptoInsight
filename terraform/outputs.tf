output "kubernetes_cluster_name" {
  description = "The name of the Kubernetes cluster"
  value       = google_container_cluster.primary.name
}

output "kubernetes_cluster_endpoint" {
  description = "The endpoint of the Kubernetes cluster"
  value       = google_container_cluster.primary.endpoint
}
