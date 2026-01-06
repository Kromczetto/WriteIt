# Real-Time Chat System

---

## Technology

- Socket.IO over WebSockets
- REST API for message persistence

---

## Architecture

- Each chat uses a deterministic room ID
- Only friends can join a chat room
- Messages are stored in MongoDB

---

## Events

- join – user joins a chat room
- send-message – sends message to room
- new-message – broadcasts message

---

## Security

- Authentication via cookies
- Authorization based on friend relationship
