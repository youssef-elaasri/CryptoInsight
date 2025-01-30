import matplotlib.pyplot as plt

# Function to read data from a file
def read_data_from_file(filename):
    request_numbers = []
    time_of_price = []
    time_of_confidence = []

    with open(filename, "r") as file:
        for line in file:
            # Skip empty lines
            if not line.strip():
                continue
            # Split the line into parts
            parts = line.strip().split(",")
            request_numbers.append(int(parts[0]))
            time_of_price.append(float(parts[1]))
            time_of_confidence.append(float(parts[2]))

    return request_numbers, time_of_price, time_of_confidence

# Main function
def main():
    # File containing the data
    filename = "request_times.txt"

    # Read data from the file
    request_numbers, time_of_price, time_of_confidence = read_data_from_file(filename)

    # Plot the data
    plt.figure(figsize=(10, 6))
    plt.plot(request_numbers, time_of_price, label="Price Endpoint", marker="o")
    plt.plot(request_numbers, time_of_confidence, label="Confidence endpoint", marker="s")

    # Add labels and title
    plt.xlabel("Number of concurrent requests")
    plt.ylabel("Time (seconds)")
    plt.title("Average response time")
    plt.legend()
    plt.grid(True)

    # Show the plot
    plt.show()

# Run the script
if __name__ == "__main__":
    main()