# NETPLAY - The Real Game

Hardcore Gaming HUD frontend for NETPLAY.

## Local Development

### Prerequisites

- Node.js

### Environment

Create a `.env` file:

```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Run

```bash
npm install
npm start
```

App:

- http://localhost:3000

## Key Endpoints

- `GET /api/courts`
- `GET /api/courts/:id`
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/bookings/my`

## Social Lobby (Socket.io)

Frontend listens/emits (backend should implement these events):

- `lobby:join`
- `lobby:users`
- `lobby:message`
- `lobby:user-joined`
