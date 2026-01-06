# Database Design

Database: MongoDB

---

## Collections

### User
- email
- password

### Work
- title
- content
- author
- status

### Rental
- user
- work
- expiresAt

### Review
- user
- work
- rating

### FriendRequest
- from
- to
- status

### Message
- from
- to
- text
- work

---

## Indexes

- Text index on Work (title, content)
- Unique compound indexes on rentals and reviews
