-- -- Insert sample locations
-- INSERT INTO locations (building, room_number, description) 
-- VALUES 
-- ('AB7', 107, 'Old acad block building'),
-- ('AB10', 201, 'New science building'),
-- ('AB1', 101, NULL),



-- Insert sensor types
INSERT INTO SensorTypes (sensor_type_name, unit, low_threshold, high_threshold) VALUES
('Temperature', '°C', 10, 35),
('Humidity', '%', 20, 80),
('Light', 'lux', 100, 1000),
('Air Quality', 'ppm', 0, 400);

-- -- Insert sample sensors
-- INSERT INTO Sensors (sensor_type_id, location_id) VALUES
-- (1, 1),  -- Temperature sensor
-- (2, 1), -- Humidity sensor
-- (3, 2);  -- Light sensor