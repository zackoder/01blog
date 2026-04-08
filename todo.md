Integration tests → endpoints (MockMvc)
E2E tests → Cypress, Postman, Selenium

🏗️ BACKEND (Spring Boot)

## A. Setup & Configuration

Initialize Spring Boot project (Maven or Gradle)

Add dependencies:

Spring Web

Spring Data JPA

Spring Security

PostgreSQL Driver

Lombok

JWT (jjwt or similar)

Initialize base packages (user, auth, post, report, notification, config)

## B. Authentication & Authorization

Implement User entity (username, email, password, roles, etc.)

Hash passwords using BCrypt

Create AuthController with endpoints:

/register

/login (returns JWT)

Configure JWT-based security (Spring Security filters)

Add roles: USER, ADMIN

Protect admin routes under /api/admin/\*\*

## C. User Module

CRUD for users (admin only for delete)

Public profile endpoint (/api/users/{username})

Subscriptions system:

Table linking follower_id ↔ followed_id

Endpoints: /follow/{id}, /unfollow/{id}, /subscriptions

Add notification entity (for new posts, follows, etc.)

## D. Posts Module

Entity: Post (id, user, text, timestamp, mediaURL)

Media upload service (store in local /uploads or AWS S3)

CRUD endpoints:

Create post (with image/video)

Edit/Delete post (only author)

List posts by user

List posts from subscriptions (feed)

Likes:

Table mapping user_id ↔ post_id

Endpoints: /like/{postId}, /unlike/{postId}

Comments:

Entity with user_id, post_id, text, timestamp

CRUD endpoints

## E. Reports & Admin

Entity: Report (reporter_id, reported_user_id, reason, timestamp)

/api/admin/reports to view all

Admin actions:

Delete user/post

Ban user

Protect all admin endpoints with role ADMIN

## F. Optional / Advanced

Real-time comments or notifications via WebSockets

Analytics service (count posts, reports, etc.)

Pagination for large feeds

💻 FRONTEND (Angular)

### A. Setup

Initialize Angular project (ng new 01blog)

Install dependencies:

Angular Material or Bootstrap

JWT-decode for token handling

HttpClient

Create modules:

auth/

user/

post/

admin/

shared/

### B. Auth Module

Login + Register components

Auth service (store JWT in localStorage)

Route guards for authenticated and admin users

### C. User Module

Profile (“block”) component: shows user posts

Follow/Unfollow button

Edit profile info

Notification dropdown (shows new posts from subscriptions)

### D. Post Module

Create/Edit/Delete post components

Media upload with preview

Feed page (infinite scroll)

Like & Comment system

Timestamp display

### E. Reporting

“Report user” modal

Submit reason (send to /api/reports)

Confirmation popup

### F. Admin Module

Dashboard with:

List of users (delete/ban)

List of posts (remove inappropriate)

List of reports (mark as resolved)

Optional analytics (charts)

Use Angular Material tables & dialogs

### G. Bonus UX Features

Real-time updates via WebSocket or polling

Dark mode toggle

Markdown editor for post text

Toast notifications for actions (like, follow, etc.)
