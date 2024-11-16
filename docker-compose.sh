#!/bin/sh

docker-compose down --volumes --rmi all &
docker-compose build --no-cache &
docker-compose up