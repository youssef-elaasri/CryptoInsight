# resource "kubernetes_manifest" "kafka_resources" {
#   manifest   = yamldecode(file("${path.module}/../Database/kafka-ressources.yaml"))
#   depends_on = [google_container_cluster.primary]
# }

# resource "kubernetes_manifest" "influxdb_resources" {
#   manifest   = yamldecode(file("${path.module}/../Database/influxdb-ressources.yaml"))
#   depends_on = [google_container_cluster.primary]
# }

resource "kubernetes_manifest" "backend_deployment" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../backend/backend-deployment.yaml"))
}

resource "kubernetes_manifest" "backend_service" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../backend/backend-service.yaml"))
}

resource "kubernetes_manifest" "influxdb_service" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../database/influxdb-service.yaml"))
}

resource "kubernetes_manifest" "influxdb_deployment" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../database/influxdb-deployment.yaml"))
}


resource "kubernetes_manifest" "kafka_deployment" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../database/kafka-deployment.yaml"))
}

resource "kubernetes_manifest" "kafka_service" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../database/kafka-service.yaml"))
}