# Courier Backend

Admin-only courier backend with tracking features.

## Prerequisites
- Node.js
- MongoDB

## Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables in `.env` (already created).
4.  Ensure MongoDB is running.

## Running the Project

1.  **Seed Database** (creates initial admin user):
    ```bash
    node seed.js
    ```
    Default Admin: `admin@example.com` / `password123`

2.  **Start Server**:
    ```bash
    npm start
    ```
    Server runs on port 5000 by default.

## API Endpoints

### Admin (Auth Required)
- `POST /admin/login`: Login admin.
  - Body: `{ "email": "admin@example.com", "password": "password123" }`
- `POST /admin/create-shipment`: Create a new shipment.
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "sender": {...}, "receiver": {...}, "origin": "NY", "destination": "LA" }`
- `POST /admin/update-tracking`: Update shipment status.
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "trackingId": "CRS...", "status": "In Transit", "location": "Chicago", "message": "Arrived at hub" }`

### Public
- `GET /track/:trackingId`: Get shipment details.
