# Google Classroom API Server (Node.js)

This project is a small Node.js server that wraps the *Google Classroom API* and exposes endpoints to authenticate with Google, list and manage courses, coursework, students/teachers, and student submissions. It was developed as part of an LFX mentorship task.

---

## Environment variables

Create a `.env` file (or copy `.env.example`) and fill these values:

```
# Example .env.example
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173   # optional: restrict CORS in production
```

*Important:* Do not commit your real `.env` to the repo.

---

## Install & run

1. Install dependencies:

```sh
npm install
```

2. Start the server:

```sh
node googleClassroom.js
```

3. (Optional) Development with auto-restart (if you add `nodemon`):

```sh
npx nodemon googleClassroom.js
```

After starting, open `http://localhost:3000` to see the root documentation JSON.

---

## Authentication quick start

1. Visit `GET /api/auth` — this returns an `authUrl` to visit for Google OAuth consent (or prints it to console depending on your server setup).
2. Complete the Google OAuth flow — Google will redirect to the `REDIRECT_URI` (e.g., `/api/google/callback`) with a `code`.
3. The server exchanges the code for tokens and uses them for API calls.

---

## Endpoints (implemented)

*Authentication*

* `GET /api/auth` — Get Google OAuth URL to authorize
* `GET /api/google/callback` — OAuth2 redirect callback

*Status & profile*

* `GET /` — Root API info / small documentation
* `GET /api/status` — Check auth status
* `GET /api/profile` — Get authenticated user profile

*Courses*

* `GET /api/courses` — List courses
* `GET /api/courses/:courseId` — Get course details
* `POST /api/courses` — Create a course (`{ name, section?, description?, room? }`)

*Users*

* `GET /api/courses/:courseId/teachers` — List teachers
* `GET /api/courses/:courseId/students` — List students

*Coursework*

* `GET /api/courses/:courseId/courseWork` — List coursework
* `POST /api/courses/:courseId/courseWork` — Create coursework/assignment (`{ title, description?, maxPoints?, dueDate? }`)

*Submissions*

* `GET /api/courses/:courseId/courseWork/:courseWorkId/studentSubmissions` — List submissions
* `PATCH /api/courses/:courseId/courseWork/:courseWorkId/studentSubmissions/:submissionId` — Update/grade a submission (`{ assignedGrade?, draftGrade? }`)

---

## Example: create a course (request body)

```json
POST /api/courses
Content-Type: application/json

{
  "name": "Intro to AI",
  "section": "G",
  "description": "Fall 2025 - Introductory course",
  "room": "Online"
}
```

---
