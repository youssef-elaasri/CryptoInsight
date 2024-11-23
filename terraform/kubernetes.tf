# resource "kubernetes_manifest" "kafka_resources" {
#   manifest   = yamldecode(file("${path.module}/../Database/kafka-ressources.yaml"))
#   depends_on = [google_container_cluster.primary]
# }

# resource "kubernetes_manifest" "influxdb_resources" {
#   manifest   = yamldecode(file("${path.module}/../Database/influxdb-ressources.yaml"))
#   depends_on = [google_container_cluster.primary]
# }

resource "kubernetes_manifest" "test_pod" {
  manifest = yamldecode(file("${path.module}/../Database/test.yaml"))
  depends_on = [
    google_container_cluster.primary,
    data.google_client_config.default
  ]
}