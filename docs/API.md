
Authentication is performed using JWT stored in HTTP-only cookies.

---

## Authentication

### Register
POST /auth/register

### Login
POST /auth/login

### Get current user
GET /auth/me

### Logout
POST /auth/logout

---

## Articles (Works)

### Create article
POST /api/works (authenticated)

### Get published articles
GET /api/works

### Search articles
GET /api/works/search?q=keyword

### Get user articles
GET /api/works/my (authenticated)

### Update article
PUT /api/works/:id (authenticated, owner only)

### Delete article
DELETE /api/works/:id (authenticated, owner only)

---

## Rentals

### Rent article
POST /api/rentals/:workId

### Get my rentals
GET /api/rentals/my

### Read rented article
GET /api/rentals/read/:workId

### Get rented article IDs
GET /api/rentals/my/work-ids

### Top rented articles
GET /api/rentals/top

---

## Reviews

### Get reviews
GET /review/:workId

### Add or update review
POST /review/:workId

---

## Friends

### Send request
POST /api/friends/request

### Get requests
GET /api/friends/requests

### Accept request
POST /api/friends/accept/:id

### Reject request
DELETE /api/friends/reject/:id

### Get friends
GET /api/friends

---

## Chat

### Get messages
GET /api/chat/:friendId

### Send message
POST /api/chat/:friendId
