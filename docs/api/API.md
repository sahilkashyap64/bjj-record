# API Reference

## Base URL
```
http://localhost:3000/v1
```

## Authentication

All endpoints require Bearer token authentication in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain tokens via `/auth/login`.

---

## Auth Endpoints

### Login / Register
```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "displayName": "John Doe" // optional
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "displayName": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "displayName": "John Doe"
}
```

---

## Sessions Endpoints

### Create Session
```
POST /sessions
Authorization: Bearer <token>
```

**Request:**
```json
{
  "durationMin": 60,
  "sRPE": 7.5,
  "sessionType": "open_mat",
  "gi": true,
  "deviceId": "device-uuid-optional"
}
```

**Response:**
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "durationMin": 60,
  "sRPE": 7.5,
  "sessionType": "open_mat",
  "gi": true,
  "syncStatus": "synced",
  "createdAt": "2024-03-12T10:00:00Z"
}
```

### List Sessions
```
GET /sessions?from=2024-03-01&to=2024-03-31&limit=50
Authorization: Bearer <token>
```

**Query Parameters:**
- `from` (optional): ISO date string, earliest session
- `to` (optional): ISO date string, latest session
- `limit` (optional, default: 50): Max results

**Response:**
```json
[
  {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "durationMin": 60,
    "sRPE": 7.5,
    "sessionType": "open_mat",
    "gi": true,
    "syncStatus": "synced",
    "rounds": [],
    "createdAt": "2024-03-12T10:00:00Z"
  }
]
```

### Get Session
```
GET /sessions/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "durationMin": 60,
  "sRPE": 7.5,
  "sessionType": "open_mat",
  "gi": true,
  "syncStatus": "synced",
  "rounds": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440001",
      "roundNumber": 1,
      "durationSec": 300,
      "position": "guard",
      "actions": []
    }
  ],
  "createdAt": "2024-03-12T10:00:00Z"
}
```

### Update Session
```
PUT /sessions/:id
Authorization: Bearer <token>
```

**Request:**
```json
{
  "durationMin": 90,
  "sRPE": 8
}
```

### Delete Session
```
DELETE /sessions/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

---

## Partners Endpoints

### Create Partner
```
POST /partners
Authorization: Bearer <token>
```

**Request:**
```json
{
  "pseudonym": "Partner A",
  "realName": "John Doe",
  "beltLevel": "Blue",
  "averageWeight": 85.5
}
```

**Response:**
```json
{
  "id": "850e8400-e29b-41d4-a716-446655440000",
  "pseudonym": "Partner A",
  "realName": "John Doe",
  "beltLevel": "Blue",
  "averageWeight": 85.5,
  "status": "active",
  "createdAt": "2024-03-12T10:00:00Z"
}
```

### List Partners
```
GET /partners
Authorization: Bearer <token>
```

### Update Partner
```
PATCH /partners/:id
Authorization: Bearer <token>
```

**Request:**
```json
{
  "beltLevel": "Purple",
  "status": "inactive"
}
```

---

## Techniques Endpoints

### Create Technique
```
POST /techniques
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "Arm Drag",
  "category": "guard_pass",
  "description": "Drag opponent's arm to cage/mat",
  "custom": true
}
```

**Response:**
```json
{
  "id": "950e8400-e29b-41d4-a716-446655440000",
  "name": "Arm Drag",
  "category": "guard_pass",
  "description": "Drag opponent's arm to cage/mat",
  "custom": true,
  "createdAt": "2024-03-12T10:00:00Z"
}
```

### List Techniques
```
GET /techniques?category=guard_pass
Authorization: Bearer <token>
```

**Query Parameters:**
- `category` (optional): Filter by category

**Categories:**
- `escape`
- `guard_pass`
- `guard_defense`
- `submission`
- `takedown`
- `sweep`
- `position`
- `other`

---

## Injuries Endpoints

### Create Injury
```
POST /injuries
Authorization: Bearer <token>
```

**Request:**
```json
{
  "bodyPart": "Left shoulder",
  "severity": "moderate",
  "notes": "Sore from guard pass training",
  "occurredDate": "2024-03-12"
}
```

**Response:**
```json
{
  "id": "a50e8400-e29b-41d4-a716-446655440000",
  "bodyPart": "Left shoulder",
  "severity": "moderate",
  "notes": "Sore from guard pass training",
  "status": "active",
  "occurredDate": "2024-03-12",
  "createdAt": "2024-03-12T10:00:00Z"
}
```

### List Injuries
```
GET /injuries
Authorization: Bearer <token>
```

### Update Injury
```
PATCH /injuries/:id
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "resolved",
  "resolvedDate": "2024-03-15"
}
```

---

## Reports Endpoints

### Weekly Report
```
GET /reports/weekly?week_start=2024-03-10
Authorization: Bearer <token>
```

**Query Parameters:**
- `week_start`: ISO date (Monday of the week)

**Response:**
```json
{
  "weekStart": "2024-03-10",
  "sessionsCount": 4,
  "totalDurationMin": 240,
  "totalLoad": 1920,
  "averageSRPE": 8,
  "kpis": {
    "escapeRate": 0.75,
    "guardPassDefenseRate": 0.60,
    "submissionFinishRate": 0.40
  }
}
```

### Monthly Report
```
GET /reports/monthly?month=2024-03
Authorization: Bearer <token>
```

**Query Parameters:**
- `month`: YYYY-MM format

**Response:**
```json
{
  "month": "2024-03",
  "sessionsCount": 16,
  "totalDurationMin": 1000,
  "totalLoad": 8000,
  "averageSRPE": 8,
  "kpis": {
    "escapeRate": 0.70,
    "guardPassDefenseRate": 0.65,
    "submissionFinishRate": 0.35
  }
}
```

---

## Sync Endpoints

### Push Changes
```
POST /sync/push
Authorization: Bearer <token>
```

**Request:**
```json
{
  "changes": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "durationMin": 90,
      "sRPE": 8
    }
  ]
}
```

**Response:**
```json
{
  "synced": 1
}
```

### Pull Changes
```
GET /sync/pull?since=2024-03-12T10:00:00Z
Authorization: Bearer <token>
```

**Query Parameters:**
- `since` (optional): Cursor timestamp, fetch changes after this

**Response:**
```json
{
  "changes": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "durationMin": 60,
      "sRPE": 7.5,
      "sessionType": "open_mat",
      "gi": true,
      "syncStatus": "synced",
      "rounds": [],
      "createdAt": "2024-03-12T10:00:00Z",
      "serverUpdatedAt": "2024-03-12T10:05:00Z"
    }
  ],
  "cursor": "2024-03-12T10:05:00Z"
}
```

---

## Error Responses

All errors return HTTP status codes with JSON body:

```json
{
  "statusCode": 400,
  "message": "Invalid request",
  "error": "Bad Request"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (resource not owned by user)
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

(To be implemented)

---

## Data Types

### Session Types
- `drilling`
- `open_mat`
- `class`
- `competition`
- `other`

### Positions
- `guard`
- `mount`
- `side_control`
- `back`
- `neutral`
- `other`

### Action Types
- `escape`
- `pass_defense`
- `submission_attempt`
- `submission_finish`
- `takedown`
- `sweep`

### Action Results
- `success`
- `failure`
- `neutral`

### Sync Status
- `pending` - Waiting to sync
- `synced` - Synced to server
- `conflict` - Merge conflict detected

### Injury Severity
- `minor`
- `moderate`
- `severe`

### Injury Status
- `active`
- `healing`
- `resolved`

---

## Pagination

List endpoints support cursor-based pagination via `limit` and `from`/`to` date range filters.

## Timestamps

All timestamps are ISO 8601 format with UTC timezone:
```
2024-03-12T10:00:00Z
```
