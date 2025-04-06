-- 1. Rooms Table: Represents classrooms or other monitored spaces.
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    building VARCHAR(50) NOT NULL,
    room_number INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (building, room_number)
);

CREATE TABLE SensorTypes (
    sensor_type_id SERIAL PRIMARY KEY,
    sensor_type_name VARCHAR(50) NOT NULL UNIQUE,  -- e.g., Temperature, Humidity, Light, AirQuality
    unit VARCHAR(20),                       -- e.g., °C, %, lux, ppm
    low_threshold DECIMAL(10,2),               
    high_threshold DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sensor_type_name)
);

-- 3. Sensors Table: store individual sensor information, like its location, status, and installation date.
CREATE TABLE Sensors (
    sensor_id SERIAL PRIMARY KEY,
    sensor_type_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    installation_date DATE,
    status VARCHAR(20) DEFAULT 'active',    -- e.g., active, inactive, maintenance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_type_id) REFERENCES SensorTypes(sensor_type_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

-- 4. SensorReadings Table: Records sensor data over time.
CREATE TABLE SensorReadings (
    reading_id BIGSERIAL PRIMARY KEY,
    sensor_id INT NOT NULL,
    reading_value DECIMAL(10, 2) NOT NULL,    -- Measurement value; adjust precision as needed
    reading_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id)
);

-- 5. Alerts Table (Optional): Log threshold breaches for proactive notifications.
CREATE TABLE Alerts (
    alert_id SERIAL PRIMARY KEY,
    sensor_id INT NOT NULL,
    reading_id INT,                         -- Reference the reading that triggered the alert
    alert_type VARCHAR(50),                 -- e.g., "Temperature High"
    alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT false,
    FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id),
    FOREIGN KEY (reading_id) REFERENCES SensorReadings(reading_id)
);
