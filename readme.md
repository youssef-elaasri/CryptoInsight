# Working with GKE

This project represents a cryptocurrency tracker platform. We use Google Kubernetes Engine (GKE) to deploy our application, and Terraform to manage the infrastructure and resources in the cloud.

## Execution Pipelines

Our pipeline consists of three main steps:

1. **Build Docker Images:**
   - We use Docker Compose to build the images for our services.
2. **Push Images to Artifact Directory:**

   - After building the images, they are pushed to an artifact directory that we have set up.

3. **Deploy Kubernetes Resources to GKE:**
   - Once the images are ready, we deploy the corresponding Kubernetes resources to GKE.

## Terraform Setup

If the GKE cluster hasn't been created yet, execute the following command:

```bash
terraform apply -target=google_container_cluster.primary
```

This command creates a new Google Kubernetes Engine cluster (primary), provisioning all the necessary resources to run the application on GKE. It will provision the compute instances, networking configurations, and the Kubernetes cluster itself.

After the cluster is created, you can apply the complete infrastructure changes by running:

```bash
terraform apply
```
