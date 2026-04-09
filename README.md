# 01blog

**01blog** is a full-featured blogging application that allows users to share their thoughts, engage with content, and manage their profiles. It includes a robust administration dashboard for content moderation and user management.

## 🚀 Features

### User Features

- **Authentication**: Secure registration and login using JWT.
- **Blog Management**: Create, edit, and delete blog posts with media support.
- **Engagement**:
  - Like and dislike posts.
  - Comment on posts.
  - Report inappropriate content.
- **Social**: Follow and unfollow other users to see their posts in your feed.
- **Profile**: Manage user profile and view followers/following.

### Admin Features

- **Dashboard**: Overview of platform activity.
- **Content Moderation**:
  - View reported content.
  - Hide or remove inappropriate blogs.
- **User Management**:
  - Ban users for policy violations.
  - Delete user accounts.

## 🛠️ Tech Stack

### Backend

- **Framework**: Spring Boot (Java)
- **Database**: PostgreSQL
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **ORM**: Spring Data JPA
- **Tools**: Lombok, Maven.

### Frontend

- **Framework**: Angular
- **Styling**: Bootstrap
- **HTTP Client**: Angular HttpClient

## ⚙️ Installation & Setup

### Prerequisites

- Java 17+
- Node.js & npm
- PostgreSQL
- Angular CLI
- Redis

### Setup

after cloning the repo run the commend
```bash
cd 01blog
```

if you don't have postgerSql installed run this commend
```bash
  ./installPostgre.sh
```

if you want to run it as a docker image run the commend

```bash
  ./buildPostgerImage.sh
```

install redis by runnig the commend

```bash
  installRides.sh
```

to run the project run the commend

```bash
  ./runner.sh
```

## 📝 API Endpoints Overview

- **Auth**: `/api/register`, `/api/login`
- **Users**: `/api/users/{username}`, `/api/users/follow/{id}`
- **Posts**: `/api/posts`, `/api/posts/{id}/like`, `/api/posts/{id}/comment`
- **Admin**: `/api/admin/reports`, `/api/admin/users/ban`

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
