
# Docker Compose Deployment Instructions

This document provides the necessary steps to deploy the application using Docker Compose.

## Prerequisites

- Ensure Docker and Docker Compose are installed on your system.

## Steps to Deploy the Application

### 1. Export Host IP Address

First, you need to export your host IP address as an environment variable. This will be used in the Docker Compose file.

Open your terminal and run the following command:

```sh
export HOST_IP=$(hostname -I | awk '{print $1}')
```

This command fetches the IP address of your host machine and stores it in the `HOST_IP` environment variable.

### 2. Run Docker Compose

After exporting the `HOST_IP` variable, you can start the application using Docker Compose. Run the following command:

```sh
docker compose up -d
```

The `-d` flag tells Docker Compose to run the containers in detached mode, meaning they will run in the background.

### 3. Verify the Deployment

To verify that the containers are running, use the following command:

```sh
docker ps
```

This will list all running containers. You should see the containers defined in your `docker-compose.yml` file listed here.

### 4. Access the Application

Once the containers are running, you can access the application through your web browser or any other client as per the service configuration in your `docker-compose.yml`.

### 5. Stopping the Application

To stop and remove the running containers, use the following command:

```sh
docker compose down
```

This will stop the containers and remove them along with any networks created by Docker Compose.
