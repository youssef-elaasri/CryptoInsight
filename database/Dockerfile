FROM influxdb:latest

WORKDIR /app
COPY requirements.txt .
COPY main.py .

RUN apt-get update && apt upgrade -y
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

COPY . .

EXPOSE 8080
EXPOSE 8000

CMD [ "/bin/sh", "-c", "/entrypoint.sh & python3 /app/main.py"]