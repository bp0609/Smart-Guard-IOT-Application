-- name: CreateSensorReading :one
INSERT INTO SensorReadings (sensor_id, reading_value)
VALUES ($1, $2)
RETURNING *;

-- name: GetSensorReadingById :one
SELECT * FROM SensorReadings
WHERE reading_id = $1;

-- name: ListSensorReadingsBySensor :many
SELECT * FROM SensorReadings
WHERE sensor_id = $1
ORDER BY reading_time DESC;

-- name: DeleteSensorReading :exec
DELETE FROM SensorReadings
WHERE reading_id = $1;