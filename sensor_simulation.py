import threading
import time
import requests
import random
import numpy as np
import json
from datetime import datetime

def generate_temperature():
    """Generates a random temperature within 10°C to 40°C using a normal distribution."""
    mean = (10 + 40) / 2  # Midpoint
    std_dev = (40 - 10) / 6  # Approx 3σ rule
    temp = np.random.normal(mean, std_dev)
    return max(10, min(40, temp))  # Clamping within range

def generate_humidity():
    """Generates a random humidity value (0% - 100%) with a normal distribution."""
    mean = 50  # Assume average humidity
    std_dev = 20  # Reasonable spread
    humidity = np.random.normal(mean, std_dev)
    return max(0, min(100, humidity))  # Clamping within range

def generate_light():
    """Generates a random light intensity value (Lux) with an exponential distribution."""
    return max(0, np.random.exponential(scale=500))  # Skewed towards lower values

def generate_air_quality():
    """Generates a random air quality index value (0 - 500) using uniform distribution."""
    return random.uniform(0, 500)

#-----------------------------------------------------------------------------------------------------
 
def send_readings(sensor_id, duration, server_url, sensor_type_index):
    start_time = time.time()
    while time.time() - start_time < duration:

        if sensor_type_index == 0:
            reading_value = generate_temperature()
        elif sensor_type_index == 1:
            reading_value = generate_humidity()
        elif sensor_type_index == 2:
            reading_value = generate_light()
        elif sensor_type_index == 3:
            reading_value = generate_air_quality()
        else:
            print(f"Sensor {sensor_id}: Invalid sensor type index {sensor_type_index}")
            continue

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
        
        time.sleep(0.5)  # Send readings every 0.5 seconds instead of continuously

def create_sensor(server_url,building, room_number, sensor_type):
    installation_date = datetime.now().strftime('%Y-%m-%d')  # Current date in YYYY-MM-DD
    status = 'active'                   

    # Construct the payload for the POST request
    payload = {
        "sensor_type": sensor_type,
        "building": building,
        "room_number": room_number,
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
    buildings = []
    rooms = []
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
                    # Only append unique values
                    if building_name not in buildings:
                        buildings.append(building_name)
                    if room not in rooms:
                        rooms.append(room)
                else:
                    print(response.json())
                    print(f"Failed to create location {location_name}, status {response.status_code}")
            except Exception as e:
                print(f"Error creating location {location_name}: {e}")
    return buildings, rooms

def main():
    # Configuration
    sensor_types = ["Temperature", "Humidity", "Light", "Air Quality"]
    duration = 60
    server_url = "http://10.7.4.38:5001"
    
    # Step 1: Create locations
    print("Creating locations...")
    buildings, rooms = create_location(server_url, 3, 3)
    
    if not buildings or not rooms:
        print("No locations were created successfully. Exiting.")
        return
    
    # Step 2: Create sensors for each location equally
    print("\nCreating sensors...")
    sensor_ids = []
    sensor_type_indices = []
    
    # Create sensors: one of each type for each location
    for building in buildings:
        for room in rooms:
            for sensor_type_idx, sensor_type in enumerate(sensor_types):
                sensor_id = create_sensor(server_url, building, room, sensor_type)
                if sensor_id:
                    sensor_ids.append(sensor_id)
                    sensor_type_indices.append(sensor_type_idx)
                    time.sleep(0.1)  # Small delay to avoid overwhelming the server
    
    if not sensor_ids:
        print("No sensors were created successfully. Exiting.")
        return
    
    print(f"\nSuccessfully created {len(sensor_ids)} sensors")
    
    # Step 3: Start threads to send readings for each sensor
    print("\nStarting to send sensor readings...")
    threads = []
    for i, sensor_id in enumerate(sensor_ids):
        thread = threading.Thread(target=send_readings, args=(sensor_id, duration, server_url, sensor_type_indices[i]))
        threads.append(thread)
        thread.start()

    # Step 4: Wait for all threads to complete
    for thread in threads:
        thread.join()

    print("\nAll sensors have finished sending data.")

if __name__ == "__main__":
    main()