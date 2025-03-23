-- name: CreateSensor :one
INSERT INTO Sensors (sensor_type_id, location_id, installation_date, status)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetSensorById :one
SELECT * FROM Sensors
WHERE sensor_id = $1 LIMIT 1;

-- name: ListSensors :many
SELECT * FROM Sensors
WHERE location_id = $1
ORDER BY sensor_id
LIMIT $2
OFFSET $3;

-- name: UpdateSensor :one
UPDATE Sensors
SET status = $2
WHERE sensor_id = $1
RETURNING *;

-- name: DeleteSensor :exec
DELETE FROM Sensors
WHERE sensor_id = $1;