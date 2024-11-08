FROM influxdb:latest

WORKDIR /app
COPY requirements.txt .
COPY start.sh .

RUN apt-get update && apt upgrade
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

COPY . .

EXPOSE 8080

CMD ["./start.sh"]