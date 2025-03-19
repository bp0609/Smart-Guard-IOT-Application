-- 1. Rooms Table: Represents classrooms or other monitored spaces.
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    location VARCHAR(255),        -- Optional: additional location info
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SensorTypes Table: Defines different sensor categories.
CREATE TABLE SensorTypes (
    sensor_type_id SERIAL PRIMARY KEY,
    sensor_type_name VARCHAR(50) NOT NULL,  -- e.g., Temperature, Humidity, Light, AirQuality
    unit VARCHAR(20),                       -- e.g., °C, %, lux, ppm
    description TEXT
);

-- 3. Sensors Table: Each sensor instance in a room.
CREATE TABLE Sensors (
    sensor_id SERIAL PRIMARY KEY,
    sensor_name VARCHAR(100),               -- Identifier or friendly name for the sensor
    sensor_type_id INT NOT NULL,
    room_id INT NOT NULL,
    installation_date DATE,
    last_calibration DATE,
    status VARCHAR(20) DEFAULT 'active',    -- e.g., active, inactive, maintenance
    FOREIGN KEY (sensor_type_id) REFERENCES SensorTypes(sensor_type_id),
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id)
);

-- 4. SensorReadings Table: Records sensor data over time.
CREATE TABLE SensorReadings (
    reading_id SERIAL PRIMARY KEY,
    sensor_id INT NOT NULL,
    reading_value DECIMAL(10, 2) NOT NULL,    -- Measurement value; adjust precision as needed
    reading_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id)
);

-- 5. Alerts Table (Optional): Log threshold breaches for proactive notifications.
CREATE TABLE Alerts (
    alert_id SERIAL PRIMARY KEY,
    sensor_id INT NOT NULL,
    reading_id INT,                         -- Reference the reading that triggered the alert
    alert_type VARCHAR(50),                 -- e.g., "Temperature High"
    alert_message TEXT,
    alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT false,
    FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id),
    FOREIGN KEY (reading_id) REFERENCES SensorReadings(reading_id)
);
