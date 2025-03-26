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
        
        time.sleep(3)

def create_sensor(server_url,location_id, sensor_type):
    installation_date = datetime.now().strftime('%Y-%m-%d')  # Current date in YYYY-MM-DD
    status = 'active'                   

    # Construct the payload for the POST request
    payload = {
        "sensor_type": sensor_type,
        "location_id": location_id,
        "installation_date": installation_date,
        "status": status
    }

    try:
        # Send POST request to create the sensor
        response = requests.post(f"{server_url}/sensors", json=payload)
        print(response.json())
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

def create_location(server_url,num_location,num_rooms):
    # Generate random data
    locations = []
    for i in range(1, num_location + 1):
        building_name = f"AB{i}"
        for room in range(101, 101 + num_rooms):
            location_name = f"{building_name}-{room}"
            payload = {
                "building": building_name,
                "room_number": room,
                "description": f"Room {room} in Building {building_name}"
            }
            try:
                response = requests.post(f"{server_url}/locations", json=payload)
                if response.status_code == 201:
                    location_id = response.json().get('location_id')  # Adjust key if necessary
                    print(f"Created location with ID {location_id}: {location_name}")
                    locations.append(location_id)
                else:
                    print(response.json())
                    print(f"Failed to create location {location_name}, status {response.status_code}")
            except Exception as e:
                print(f"Error creating location {location_name}: {e}")
    return locations

def main():
    # Configuration
    sensor_types = ["temperature", "humidity", "light", "air_quality"]
    duration = 90
    server_url = "http://localhost:5000"
    location_ids=create_location(server_url,10,10)
    sensor_ids = []
    for location_id in location_ids:
        for sensor_type in sensor_types:
            sensor_id = create_sensor(server_url,location_id,sensor_type)
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