FROM influxdb:latest

WORKDIR /app
COPY requirements.txt .
COPY main.py .

# Install Python and required packages
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y python3 python3-pip
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

COPY . .

EXPOSE 8080

# Start InfluxDB and run the Python script
CMD ["/bin/sh", "-c", "/entrypoint.sh & python3 /app/main.py"]
