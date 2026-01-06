# Security Model

---

## Authentication

- JWT-based authentication
- Tokens stored in HTTP-only cookies
- Automatic session persistence

---

## Authorization

- Route-level protection using middleware
- Ownership validation for articles and rentals
- Friend-only access for chat functionality

---

## Data Protection

- Password hashing using bcrypt
- Input validation on backend
- Restricted access to sensitive endpoints

---

## Known Limitations

- No rate limiting implemented
- No refresh token rotation
- HTTPS required in production
