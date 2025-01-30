import requests
import concurrent.futures
import time
import argparse
import json

# Function to send a request (without waiting for the response)
def send_request(url):
    try:
        requests.get(url, timeout=5)  # Send the request (ignore the response)
    except Exception as e:
        # Log the error if needed
        pass

# Function to send n requests at once every second
def send_requests_per_second(ip, requests_per_second, duration):
    url = f"http://{ip}:8080/api/mci?token=BTCUSDT"
    results = []
    start_time = time.time()
    end_time = start_time + duration

    print(f"Sending {requests_per_second} requests at once every second to {url} for {duration} seconds...")

    while time.time() < end_time:
        # Use ThreadPoolExecutor to send all requests concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=requests_per_second) as executor:
            # Submit all requests at once
            futures = [executor.submit(send_request, url) for _ in range(requests_per_second)]
            # Wait for all requests to be sent (but not for responses)
            concurrent.futures.wait(futures, timeout=0)

        # Sleep until the next second
        time.sleep(1)

    print(f"\nCompleted sending {requests_per_second} requests at once every second for {duration} seconds.")

# Main function
def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Send n requests at once every second to a specified endpoint.")
    parser.add_argument("--ip", type=str, required=True, help="IP address of the service")
    parser.add_argument("--rps", type=int, required=True, help="Number of requests to send at once every second")
    parser.add_argument("--duration", type=int, required=True, help="Duration in seconds to send requests")
    args = parser.parse_args()

    # Send requests at the specified rate
    send_requests_per_second(args.ip, args.rps, args.duration)

# Run the script
if __name__ == "__main__":
    main()