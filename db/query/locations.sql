-- name: CreateLocation :one
INSERT INTO locations (building, room_number, description)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetLocationById :one
SELECT * FROM locations
WHERE location_id = $1;

-- name: ListLocations :many
SELECT * FROM locations
WHERE building = $1
ORDER BY room_number
LIMIT $2
OFFSET $3;

-- name: UpdateLocation :one
UPDATE locations
SET building = COALESCE($2, building),
    room_number = COALESCE($3, room_number),
    description = COALESCE($4, description),
    updated_at = CURRENT_TIMESTAMP
WHERE location_id = $1
RETURNING *;

-- name: DeleteLocation :exec
DELETE FROM locations
WHERE location_id = $1;