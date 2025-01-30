# Environment Selection

Our application can run both **locally** using Docker Compose and in **Google Cloud Platform (GCP)**. To switch between these environments, the API URLs in the application need to be adjusted accordingly.

To simplify this process, we provide the **`scope.sh`** script, which automatically applies the necessary configuration changes.

## How to Use `scope.sh`

1. **Grant execution permission to the script:**

   ```sh
   chmod +x scope.sh

   ```

2. **Run the script:**
   ```sh
   ./scope.sh
   ```
3. **Select the environment:**

- You will be prompted to enter either local or remote.
- The script will then configure the application for the chosen environment.

# Working locally

We use **Docker Compose** to run the application in a local environment.

## Steps to Run Locally:

1. **Execute the following command:**

   ```sh
   docker compose -f docker-compose-local.yml up -d

   ```

2. **Wait for the containers to start running.**

3. **Once the setup is complete, open your browser and go to:**
   http://localhost:8000

# Working with GKE

We use Google Kubernetes Engine (GKE) to deploy our application, and Terraform to manage the infrastructure and resources in the cloud.

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
