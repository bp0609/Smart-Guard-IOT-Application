-- -- Insert sample locations
-- INSERT INTO locations (building, room_number, description) 
-- VALUES 
-- ('AB7', 107, 'Old acad block building'),
-- ('AB10', 201, 'New science building'),
-- ('AB1', 101, NULL),



-- Insert sensor types
INSERT INTO SensorTypes (sensor_type_name, unit,low_threshold, high_threshold) VALUES
('temperature', '°C', 10,40),
('humidity', '%', NULL,100),
('light', 'lux', NULL,NULL),
('air_quality', 'ppm', NULL,500);

-- -- Insert sample sensors
-- INSERT INTO Sensors (sensor_type_id, location_id) VALUES
-- (1, 1),  -- Temperature sensor
-- (2, 1), -- Humidity sensor
-- (3, 2);  -- Light sensor