#!/bin/bash

# File to be modified
FILE_PATH="frontend/src/app/controllers/cryptocurrency/cryptocurrency.service.ts"
ENV_FILE_PATH="frontend/src/environments/environment.ts"
ENV_DEV_FILE_PATH="frontend/src/environments/environment.development.ts"
SPRING_PROPERTIES_FILE="backend/src/main/resources/application.properties"
NGINX_CONF_FILE="frontend/default.conf"

# Check if the files exist
if [[ ! -f "$FILE_PATH" ]]; then
    echo "File not found: $FILE_PATH"
    exit 1
fi

if [[ ! -f "$ENV_FILE_PATH" ]]; then
    echo "File not found: $ENV_FILE_PATH"
    exit 1
fi

if [[ ! -f "$ENV_DEV_FILE_PATH" ]]; then
    echo "File not found: $ENV_DEV_FILE_PATH"
    exit 1
fi

if [[ ! -f "$SPRING_PROPERTIES_FILE" ]]; then
    echo "File not found: $SPRING_PROPERTIES_FILE"
    exit 1
fi

if [[ ! -f "$NGINX_CONF_FILE" ]]; then
    echo "File not found: $NGINX_CONF_FILE"
    exit 1
fi

# Ask the user for input
echo "Enter 'local' or 'remote' : "
read USER_INPUT

# Determine the new socketApi, environment apiUrl, Spring Boot properties, and Nginx proxy settings
if [[ "$USER_INPUT" == "local" ]]; then
    NEW_SOCKET_API="http://localhost:8080/sockjs-websocket"
    NEW_API_URL="http://localhost:8080/api/"
    NEW_INFLUXDB_URL="http://influxdb:8086"
    NEW_KAFKA_CONSUMER_SERVERS="kafka:9094"
    NEW_KAFKA_BROKER="kafka:9092"
    NEW_PROXY_PASS="http://backend:8080/"
elif [[ "$USER_INPUT" == "remote" ]]; then
    NEW_SOCKET_API="/backend/sockjs-websocket"
    NEW_API_URL="/backend/api/"
    NEW_INFLUXDB_URL="http://influxdb-service:8086"
    NEW_KAFKA_CONSUMER_SERVERS="kafka-service:9094"
    NEW_KAFKA_BROKER="kafka-service:9092"
    NEW_PROXY_PASS="http://backend-service:8080/"
else
    echo "Invalid input. Please enter 'local' or 'remote'."
    exit 1
fi

# Use sed to update the CryptocurrencyService.ts file
sed -i 's|private socketApi = ".*"|private socketApi = "'"$NEW_SOCKET_API"'"|g' "$FILE_PATH"

# Use sed to update the environment.ts file
sed -i 's|apiUrl: ".*"|apiUrl: "'"$NEW_API_URL"'"|g' "$ENV_FILE_PATH"

# Use sed to update the environment.development.ts file
sed -i 's|apiUrl: ".*"|apiUrl: "'"$NEW_API_URL"'"|g' "$ENV_DEV_FILE_PATH"

# Use sed to update the Spring Boot application.properties file
sed -i 's|influxdb.url=.*|influxdb.url='"$NEW_INFLUXDB_URL"'|g' "$SPRING_PROPERTIES_FILE"
sed -i 's|spring.kafka.consumer.bootstrap-servers=.*|spring.kafka.consumer.bootstrap-servers='"$NEW_KAFKA_CONSUMER_SERVERS"'|g' "$SPRING_PROPERTIES_FILE"
sed -i 's|kafka.broker=.*|kafka.broker='"$NEW_KAFKA_BROKER"'|g' "$SPRING_PROPERTIES_FILE"

# Use sed to update the Nginx configuration file
sed -i 's|proxy_pass http://backend.*;|proxy_pass '"$NEW_PROXY_PASS"';|g' "$NGINX_CONF_FILE"

echo "Updated socketApi to: $NEW_SOCKET_API"
echo "Updated apiUrl to: $NEW_API_URL"
echo "Updated influxdb.url to: $NEW_INFLUXDB_URL"
echo "Updated spring.kafka.consumer.bootstrap-servers to: $NEW_KAFKA_CONSUMER_SERVERS"
echo "Updated kafka.broker to: $NEW_KAFKA_BROKER"
echo "Updated Nginx proxy_pass to: $NEW_PROXY_PASS"