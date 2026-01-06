# Developer Setup & Installation Guide

This document describes how to configure, install, and run the project locally in a development environment.

---

## System Requirements

- Node.js ≥ 18.x
- npm ≥ 9.x
- MongoDB ≥ 6.x
- Modern web browser (Chrome, Firefox)

---

## Repository Structure

The project consists of two main components:
- **client/** – frontend (React + TypeScript)
- **server/** – backend (Node.js + Express)

---

## Backend Installation
- cd server
- npm install
- npm start

## Frontend Installation
- cd client
- npm install
- npm run dev

## The frontend application will run on:
- http://localhost:5173


## Environment Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=8000
MONGO_URL=mongo_db_link
JWT_SECRET=your_secure_secret

