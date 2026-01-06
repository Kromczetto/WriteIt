# System Architecture

The system follows a client–server architecture with clear separation of concerns.

---

## High-Level Overview

- Frontend: React (SPA)
- Backend: Node.js + Express
- Database: MongoDB
- Real-time layer: Socket.IO

---

## Application Layers

1. Presentation Layer – React UI
2. Application Layer – Express controllers
3. Domain Layer – Mongoose models
4. Infrastructure Layer – MongoDB, WebSockets, PDF generation

---

## Design Patterns

- MVC (Model–View–Controller)
- RESTful API
- Context-based state management
- Event-driven real-time communication

---

## Data Flow

1. User interacts with frontend
2. Frontend sends HTTP or WebSocket requests
3. Backend validates authentication and authorization
4. Database operations are performed
5. Response is returned to the client
