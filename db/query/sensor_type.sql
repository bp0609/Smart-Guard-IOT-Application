-- name: CreateSensorType :one
INSERT INTO SensorTypes (sensor_type_name, unit, description)
VALUES ($1, $2, $3)
RETURNING *;


-- name: GetSensorTypeByID :one
SELECT * FROM SensorTypes
WHERE sensor_type_id = $1 LIMIT 1;

-- name: GetSensorTypeByName :one
SELECT * FROM SensorTypes
WHERE sensor_type_name = $1 LIMIT 1;

-- name: ListSensorTypes :many
SELECT * FROM SensorTypes
WHERE unit = $1
ORDER BY sensor_type_name
LIMIT $2
OFFSET $3;

-- name: UpdateSensorType :one
UPDATE SensorTypes
SET sensor_type_name = COALESCE($2, sensor_type_name),
    unit = COALESCE($3, unit),
    description = COALESCE($4, description)
WHERE sensor_type_id = $1
RETURNING *;

-- name: DeleteSensorType :exec
DELETE FROM SensorTypes
WHERE sensor_type_id = $1;