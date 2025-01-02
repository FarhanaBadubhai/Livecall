# Live Call App

A real-time video conferencing application built with Node.js and 100ms SDK.

## Features

- User Authentication
- Create Video Rooms
- List the rooms


## Tech Stack

- Node.js
- Express
- PostgreSQL
- 100ms SDK
- WebSocket
- JWT Authentication

## Setup

1. Clone the repository:
```bash
git clone https://github.com/FarhanaBadubhai/Livecall.git

Install dependencies:
npm install


API Endpoints i used:

POST /api/auth/register - Register new user
POST /api/auth/login - User login
POST /api/rooms/create - Create new room
GET /api/rooms/list - List all rooms
POST /api/rooms/token - Generate room token
