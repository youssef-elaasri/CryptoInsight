variable "project_id" {
  description = "The ID of the project in Google Cloud"
  type        = string
  default= "dev-guild-439910-e9"
}

variable "region" {
  description = "The region in which the cluster will be created"
  type        = string
  default="europe-west12"

}

variable "zone" {
  description = "The zone in which the cluster will be created"
  type        = string
  default="europe-west12-a"

}