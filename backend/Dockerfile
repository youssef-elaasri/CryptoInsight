# Use an official lightweight Linux distribution
FROM ubuntu:latest

# Install any necessary packages (optional)
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Set the working directory (optional)
WORKDIR /app

# Copy any application files if necessary
# COPY . .
EXPOSE 3000
# Run an infinite loop to keep the container running
CMD ["bash", "-c", "while true;do:done"]
