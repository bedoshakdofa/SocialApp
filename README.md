# Social Media App

A Node.js/Express-based social media backend API with user authentication, posts, comments, and group management.

## Features

-   **User Authentication**: Signup, login, email verification, password reset, JWT-based authentication.
-   **User Profile**: Update profile, upload profile photo, delete account.
-   **Posts**: Create, update, delete, and view posts. Posts can belong to groups or be public.
-   **Comments**: Add, update, and delete comments on posts.
-   **Groups**: Create groups, join/leave groups, post within groups, search for groups.
-   **Email Notifications**: Email verification and password reset via email.
-   **Authorization**: Route protection and permission checks for sensitive actions.

## Models

### User

-   `firstName` (String, required)
-   `lastName` (String, required)
-   `gender` (String, enum: "male", "female")
-   `photo` (String, default: "default.jpg")
-   `links` (String)
-   `email` (String, required, unique)
-   `active` (Boolean, default: false)
-   `password` (String, required, min 8 chars)
-   `passwordConfirm` (String, required, must match password)
-   `passwordChangeAt` (Date)
-   `group` (Array of Group references)
-   `Token`, `TokenExp` (for password/email verification)
-   `OTP`, `OTPExp` (for OTP features)

### Post

-   `content` (String, required)
-   `user` (User reference)
-   `group` (Group reference, optional)
-   Virtual: `comments` (all comments on this post)

### Comment

-   `content` (String, required)
-   `user` (User reference)
-   `post` (Post reference)
-   `group` (Group reference, optional)

### Group

-   `groupName` (String, required, 5-30 chars)
-   `user` (Array of User references, group members)
-   `groupAdmin` (User reference)

## API Endpoints

### Auth/User

-   `POST /api/v1/users/signup` — Register a new user
-   `PATCH /api/v1/users/verfiyemail/:token` — Verify email
-   `POST /api/v1/users/login` — Login
-   `POST /api/v1/users/forgetpassword` — Request password reset
-   `PATCH /api/v1/users/restpassword/:token` — Reset password
-   `POST /api/v1/users/updatePass` — Update password (auth required)
-   `PATCH /api/v1/users/updateMe` — Update profile (auth required)
-   `GET /api/v1/users/Me` — Get current user profile (auth required)
-   `DELETE /api/v1/users/deleteMe` — Delete account (auth required)

### Posts

-   `POST /api/v1/post/` — Create post (auth required)
-   `GET /api/v1/post/` — Get all posts
-   `GET /api/v1/post/:id` — Get single post
-   `PATCH /api/v1/post/:id` — Update post (auth required, owner only)
-   `DELETE /api/v1/post/:id` — Delete post (auth required, owner only)

### Comments

-   `POST /api/v1/post/:postId/comment/` — Add comment to post (auth required)
-   `PATCH /api/v1/post/:postId/comment/:id` — Update comment (auth required, owner only)
-   `DELETE /api/v1/post/:postId/comment/:id` — Delete comment (auth required, owner only)

### Groups

-   `POST /api/v1/group/create` — Create group (auth required)
-   `POST /api/v1/group/search` — Search groups
-   `PATCH /api/v1/group/join/:groupId` — Join group (auth required)
-   `PATCH /api/v1/group/leave/:groupId` — Leave group (auth required)
-   `POST /api/v1/group/:groupId` — Create post in group (auth required, must be member)
-   `GET /api/v1/group/:groupId` — Get all posts in group

## Getting Started

1. **Install dependencies:**
    ```sh
    npm install
    ```
