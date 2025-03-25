import threading
import time
import requests
import random
from datetime import datetime

def send_readings(sensor_id, duration, server_url):
    start_time = time.time()
    while time.time() - start_time < duration:
        reading_value = random.uniform(0, 100)
        payload = {"reading_value": reading_value}
        url = f"{server_url}/sensors/{sensor_id}/readings"
        
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 201:
                reading_id = response.json().get('reading_id')  # Adjust key if necessary
                print(f"Sensor {sensor_id}: Sent reading {reading_value:.2f}, reading ID {reading_id}")
            else:
                print(f"Sensor {sensor_id}: Failed to send reading, status {response.status_code}")
        except Exception as e:
            print(f"Sensor {sensor_id}: Error sending reading: {e}")
        
        time.sleep(10)

def create_sensor(server_url):
    # Generate random data
    sensor_type_id = random.randint(1, 4)  # Random sensor_type_id from 1 to 4
    location_id = random.randint(1, 10)    # Random location_id from 1 to 10
    installation_date = datetime.now().strftime('%Y-%m-%d')  # Current date in YYYY-MM-DD
    status = 'active'                      # Default status

    # Construct the payload for the POST request
    payload = {
        "sensor_type_id": sensor_type_id,
        "location_id": location_id,
        "installation_date": installation_date,
        "status": status
    }

    try:
        # Send POST request to create the sensor
        response = requests.post(f"{server_url}/sensors", json=payload)
        if response.status_code == 201:
            # Extract sensor ID from the response
            sensor_id = response.json().get('sensor_id')  # Adjust key if necessary
            print(f"Created sensor with ID {sensor_id}")
            return sensor_id
        else:
            print(f"Failed to create sensor, status {response.status_code}")
            return None
    except Exception as e:
        print(f"Error creating sensor: {e}")
        return None

def main():
    # Configuration
    num_sensors = 5                # Number of sensors to create
    duration = 60                  # Duration in seconds to send readings
    server_url = "http://localhost:5000"  # Server API base URL

    # Step 1: Create sensors and collect their IDs
    sensor_ids = []
    for _ in range(num_sensors):
        sensor_id = create_sensor(server_url)
        if sensor_id is not None:
            sensor_ids.append(sensor_id)

    if not sensor_ids:
        print("No sensors were created successfully. Exiting.")
        return

    # Step 2: Start threads to send readings for each sensor
    threads = []
    for sensor_id in sensor_ids:
        thread = threading.Thread(target=send_readings, args=(sensor_id, duration, server_url))
        threads.append(thread)
        thread.start()

    # Step 3: Wait for all threads to complete
    for thread in threads:
        thread.join()

    print("All sensors have finished sending data.")

if __name__ == "__main__":
    main()