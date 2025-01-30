import requests
import argparse
import matplotlib.pyplot as plt
import time
import statistics
from concurrent.futures import ThreadPoolExecutor

def send_request(ip, url):
    try:
        response = requests.get(url)
        return response.elapsed.total_seconds()
    except requests.RequestException:
        return None

def stress_test(ip, num_requests):
    prices_url = f"http://{ip}:8080/api/influxdb/getLastTwoPeriods?startTime=2000-01-01T00:00:00Z&stopTime=2100-01-01T00:00:00Z&windowPeriod=1h"
    mci_url = f"http://{ip}:8080/api/mci?token=BTCUSDT"
    
    median_prices_times = []
    median_mci_times = []
    
    with open("request_times.txt", "w") as f:
        for i in range(1, num_requests + 1):
            # Use ThreadPoolExecutor to send requests concurrently
            with ThreadPoolExecutor() as executor:
                prices_times = list(executor.map(lambda _: send_request(ip, prices_url), range(i)))
                mci_times = list(executor.map(lambda _: send_request(ip, mci_url), range(i)))
            
            # Filter out None values (failed requests)
            prices_times = [t for t in prices_times if t is not None]
            mci_times = [t for t in mci_times if t is not None]
            
            # Calculate the median response time for each set of requests
            median_prices = statistics.median(prices_times) if prices_times else 0
            median_mci = statistics.median(mci_times) if mci_times else 0
            
            median_prices_times.append(median_prices)
            median_mci_times.append(median_mci)
            
            f.write(f"{i},{median_prices},{median_mci}\n")
    
    plot_results(range(1, num_requests + 1), median_prices_times, median_mci_times)

def plot_results(x_values, prices_y_values, mci_y_values):
    plt.figure(figsize=(10, 5))
    plt.plot(x_values, prices_y_values, marker='o', label="Prices Median Response Time")
    plt.plot(x_values, mci_y_values, marker='s', label="MCI Median Response Time")
    plt.xlabel("Number of Requests")
    plt.ylabel("Median Response Time (seconds)")
    plt.title("Median Response Time vs Number of Requests")
    plt.legend()
    plt.grid()
    plt.show()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Stress test a service by sending multiple requests.")
    parser.add_argument("ip", type=str, help="Target IP address")
    parser.add_argument("num_requests", type=int, help="Number of request iterations")
    
    args = parser.parse_args()
    stress_test(args.ip, args.num_requests)
