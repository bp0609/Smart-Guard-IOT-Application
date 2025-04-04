**API Documentation**

### 1. Get All Locations

**URL:** `/locations`
**Method:** GET

**Description:**
Fetches a list of all locations stored in the database.

**Response:**

- **Success (200 OK):** Returns an array of json objects.
- **Failure (500 Internal Server Error):** Returns an error message.

**Example Request:**

```http
GET /locations
```

**Example Response:**

```json
[
  {
    "location_id": 1,
    "building": "AB1",
    "room_number": 101,
    "description": "Room 101 in Building AB1",
    "created_at": "2025-04-03T12:17:33.017Z"
  },
  {
    "location_id": 2,
    "building": "AB1",
    "room_number": 102,
    "description": "Room 102 in Building AB1",
    "created_at": "2025-04-03T12:17:33.041Z"
  }
]
```

---

### 2. Create a Location

**URL:** `/locations`
**Method:** POST
**Request Body (JSON):**

```json
{
  "building": "AB1",
  "room_number": "111",
  "description": "5G Lab"
}
```

**Description:**
Creates a new location record in the database.

**Response:**

- **Success (201 Created):** Returns the created location object.
- **Failure (500 Internal Server Error):** Returns an error message.

**Example Request:**

```http
POST /locations
```

**Example Response:**

```json
{
  "location_id": 12,
  "building": "AB1",
  "room_number": 111,
  "description": "5G Lab",
  "created_at": "2025-04-03T16:54:25.119Z"
}
```

---

### 3. Update a Location

**URL:** `/locations/:locationID`
**Method:** PUT
**Path Parameters:**

- `locationID` (integer) - ID of the location to update

**Request Body (JSON) (Optional Fields):**

```json
{
  "building": "AB20",
  "room_number": "404",
  "description": "New description"
}
```

**Description:**
Updates an existing location's details. Only provided fields will be updated.

**Response:**

- **Success (200 OK):** Returns the updated location object.
- **Failure (404 Not Found):** Location ID not found.
- **Failure (500 Internal Server Error):** Returns an error message.

**Example Request:**

```http
PUT /locations/3
```

**Example Response:**

```json
{
  "location_id": 3,
  "building": "D",
  "room_number": "404",
  "description": "New description"
}
```

---

### 4. Delete a Location

**URL:** `/locations/:locationID`
**Method:** DELETE
**Query Parameters:** None
**Path Parameters:**

- `locationID` (integer) - ID of the location to delete

**Request Body:** None

**Description:**
Deletes a location from the database.

**Response:**

- **Success (204 No Content):** Location deleted successfully.
- **Failure (404 Not Found):** Location ID not found.
- **Failure (500 Internal Server Error):** Returns an error message.

**Example Request:**

```http
DELETE /locations/3
```

**Example Response:**
_No response body for 204 No Content._

---

### 5. Get All Sensor Types

**URL:** `/sensor-types`  
**Method:** GET  
**Description:** Retrieves a list of all sensor types available in the system.  
**Response:**

```json
[
  {
    "sensor_type_id": 1,
    "sensor_type_name": "Temperature",
    "unit": "Celsius",
    "low_threshold": 0,
    "high_threshold": 100
  }
]
```

---

### 6. Create a New Sensor Type

**URL:** `/sensorTypes`  
**Method:** POST
**Request Body:**

```json
{
  "sensor_type_name": "Temperature",
  "unit": "Celsius",
  "low_threshold": 0,
  "high_threshold": 100
}
```

**Description:** Creates a new sensor type with specified details.  
**Response:**

```json
{
  "sensor_type_id": 1,
  "sensor_type_name": "Temperature",
  "unit": "Celsius",
  "low_threshold": 0,
  "high_threshold": 100
}
```

---

### 7. Update Sensor Type

**URL:** `/sensorTypes/:id`  
**Method:** PUT  
**Path Parameters:**

- `id` (integer) - The ID of the sensor type to update  
  **Request Body:**

```json
{
  "sensor_type_name": "Humidity",
  "unit": "%",
  "low_threshold": 10,
  "high_threshold": 90
}
```

**Description:** Updates an existing sensor type with new details. If a field is not provided, it remains unchanged.  
**Response:**

```json
{
  "sensor_type_id": 1,
  "sensor_type_name": "Humidity",
  "unit": "%",
  "low_threshold": 10,
  "high_threshold": 90
}
```

---

### 8. Delete Sensor Type

**URL:** `/sensorTypes/:id`  
**Method:** DELETE  
**Path Parameters:**

- `id` (integer) - The ID of the sensor type to delete  
  **Request Body:** None  
  **Description:** Deletes a sensor type from the system.  
  **Response:**
- `204 No Content` (If successful)
- `404 Not Found` (If the sensor type ID does not exist)

```json
{
  "message": "Sensor type not found"
}
```

---

### 9. Get All Sensors

**URL:** `/sensors`
**Method:** GET

**Description:**
Fetches a list of all sensors stored in the database.

**Response:**

- **Success (200 OK):** Returns an array of json objects.
- **Failure (500 Internal Server Error):** Returns an error message.

**Example Request:**

```http
GET /sensors
```

**Example Response:**

```json
[
  {
    "sensor_id": 1,
    "sensor_type_id": 1,
    "location_id": 1,
    "installation_date": "2025-04-02T18:30:00.000Z",
    "status": "active",
    "created_at": "2025-04-03T12:17:33.177Z"
  },
  {
    "sensor_id": 2,
    "sensor_type_id": 2,
    "location_id": 1,
    "installation_date": "2025-04-02T18:30:00.000Z",
    "status": "active",
    "created_at": "2025-04-03T12:17:33.202Z"
  }
]
```

---

### 10. Add a Sensor

**URL:** `/sensors`
**Method:** POST
**Request Body (JSON):**

```json
{
  "sensor_type": "Temperature",
  "building": "A",
  "room_number": "101",
  "installation_date": "2024-03-01",
  "status": "Active"
}
```

**Description:**
Creates a new sensor record by taking building, room number, and sensor type name in the database.

**Response:**

- **Success (201 Created):** Returns the created sensor object.
- **Failure (400 Bad Request):** Location or sensor type not found.
- **Failure (500 Internal Server Error):** Returns an error message.

**Example Request:**

```http
POST /sensors
```

**Example Response:**

```json
{
  "sensor_id": 3,
  "sensor_type_id": 1,
  "location_id": 2,
  "installation_date": "2024-03-01",
  "status": "Active"
}
```

---

### 11. Update a Sensor

**URL:** `/sensors/:sensorID`
**Method:** PUT
**Path Parameters:**

- `sensorID` (integer) - ID of the sensor to update

**Request Body (JSON) (Optional Fields):**

```json
{
  "sensr_type_id": 2,
  "location_id": 2,
  "status": "inactive"
}
```

**Description:**
Updates an existing sensor's details. Only provided fields will be updated.

**Example Request:**

```http
PUT /sensors/1
```

**Example Response:**

```json
{
  "sensor_id": 1,
  "sensor_type_id": 1,
  "location_id": 1,
  "installation_date": "2025-04-02T18:30:00.000Z",
  "status": "inactive",
  "created_at": "2025-04-03T12:17:33.177Z"
}
```

---

### 12. Get Sensor Readings for a Specific Sensor

**Endpoint:** `GET /sensors/:sensorId/readings`

**Description:** Retrieves all readings for a given sensor, ordered by reading time in descending order.

**Request Parameters:**

- `sensorId` (path) - The ID of the sensor.

**Response:**

```json
[
  {
    "reading_id": 1,
    "sensor_id": 10,
    "reading_value": 25.6,
    "reading_time": "2024-04-02T12:30:00Z"
  }
]
```

---

### 13. Create a Sensor Reading

**Endpoint:** `POST /sensors/:sensorId/readings`

**Description:** Adds a new reading for a sensor. If the reading exceeds thresholds, an alert is created.

**Request Parameters:**

- `sensorId` (path) - The ID of the sensor.

**Request Body:**

```json
{
  "reading_value": 30.5
}
```

**Response:**

```json
{
  "reading_id": 2,
  "sensor_id": 10,
  "reading_value": 30.5,
  "reading_time": "2024-04-02T12:35:00Z"
}
```

**Additional Behavior:**

- If `reading_value` exceeds `low_threshold` or `high_threshold`, an alert is created.
- If the reading is within thresholds, the alert is marked as resolved.

---

### 14. Get Sensor Readings by Location

**Endpoint:** `GET /sensors/:building/:room_number/readings`

**Description:** Retrieves sensor readings for a specific location.

**Request Parameters:**

- `building` (path) - Building name.
- `room_number` (path) - Room number.

**Request Body:** (Optional time range filter)

```json
{
  "start_time": "2024-04-01T00:00:00Z",
  "end_time": "2024-04-02T23:59:59Z"
}
```

**Response:**

```json
[
  {
    "sensor_id": 2,
    "sensor_type": "humidity",
    "sensor_data": {
      "timestamps": ["03/04/25-17:47:46", "03/04/25-17:47:43"],
      "readings": ["32.28", "89.07"]
    }
  },
  {
    "sensor_id": 3,
    "sensor_type": "light",
    "sensor_data": {
      "timestamps": ["03/04/25-17:47:46", "03/04/25-17:47:43"],
      "readings": ["105.60", "297.09"]
    }
  },
  {
    "sensor_id": 1,
    "sensor_type": "temperature",
    "sensor_data": {
      "timestamps": ["03/04/25-17:47:45", "03/04/25-17:47:42"],
      "readings": ["26.32", "23.62"]
    }
  },
  {
    "sensor_id": 4,
    "sensor_type": "air_quality",
    "sensor_data": {
      "timestamps": ["03/04/25-17:47:45", "03/04/25-17:47:42"],
      "readings": ["454.70", "17.97"]
    }
  }
]
```

---

### 15. GET /alerts

**Endpoint:** `GET /alerts`

**Description:** Retrieves the latest unresolved alerts for each sensor.

**Response:**

```json
[
  {
    "sensor_id": 1,
    "building": "A",
    "room_number": 101,
    "sensor_type_name": "Temperature",
    "alert_time": "2024-04-03T12:30:00.000Z",
    "reading_value": 78.5
  }
]
```

**Errors:**

- 404: No unresolved alerts found
- 500: Failed to fetch alerts

---

### 16. GET /alerts/logs

**Endpoint:** `GET /alerts/logs`

**Description:** Retrieves all alert logs from the database.

**Response:**

```json
[
  {
    "alert_id": 1,
    "sensor_id": 1,
    "reading_id": 12,
    "alert_time": "2024-04-03T12:30:00.000Z",
    "resolved": false
  }
]
```

**Errors:**

- 500: Failed to fetch alerts

---
