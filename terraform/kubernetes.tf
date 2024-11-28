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


resource "kubernetes_manifest" "datastreamer_deployment" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../dataStreamer/datastreamer-deployment.yaml"))
}

resource "kubernetes_manifest" "datastreamer_svc" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../dataStreamer/datastreamer-svc.yaml"))
}


resource "kubernetes_manifest" "sre_service_account" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/service-account.yaml"))
}

resource "kubernetes_manifest" "sre_config_map" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/config-map.yaml"))
}

resource "kubernetes_manifest" "sre_grafana_config_map" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/grafana-datasource-config.yaml"))
}

resource "kubernetes_manifest" "sre_cluster_role_ks" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/cluster-role-ks.yaml"))
}

resource "kubernetes_manifest" "sre_cluster_role_ks_binding" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/cluster-role-ks-binding.yaml"))
}

resource "kubernetes_manifest" "sre_cluster_role_prom" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/cluster-role-prom.yaml"))
}

resource "kubernetes_manifest" "sre_cluster_role_prom_binding" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/cluster-role-prom-binding.yaml"))
}

resource "kubernetes_manifest" "sre_deployment" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/sre-deployment.yaml"))
}
resource "kubernetes_manifest" "grafana_svc" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/grafana-svc.yaml"))
}
resource "kubernetes_manifest" "prom_svc" {
  depends_on = [google_container_cluster.primary]
  manifest   = yamldecode(file("../sre/prom-svc.yaml"))
}



