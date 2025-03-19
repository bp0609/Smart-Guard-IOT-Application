-- Insert sample locations
INSERT INTO locations (building, room_number, description) 
VALUES ('AB7', 107, 'Old acad block building'),
('AB10', 201, 'New science building');

-- Insert sensor types
INSERT INTO SensorTypes (sensor_type_name, unit) VALUES
('temperature', '°C'),
('humidity', '%'),
('light', 'lux'),
('air_quality', 'ppm');

-- Insert sample sensors
INSERT INTO Sensors (sensor_type_id, location_id) VALUES
(1, 1),  -- Temperature sensor
(2, 1), -- Humidity sensor
(3, 2);  -- Light sensor