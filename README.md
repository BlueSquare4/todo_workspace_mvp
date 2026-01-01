# Task Workspace MVP – Backend

A minimal Express.js backend for a task/workspace application with SQLite-based persistence.  
This service provides CRUD APIs for managing tasks and serves as the data layer for an in-app AI copilot.

## Tech Stack
- Node.js
- Express.js
- SQLite (better-sqlite3)

## Setup

```bash
cd server
npm install
npm run dev
````

Server runs on: `http://localhost:4000`

## API Endpoints

### Health Check

**GET** `/health`
Returns server status.

---

### Create Task

**POST** `/tasks`

```json
{
  "title": "Sample task",
  "description": "Optional description",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-01-03"
}
```

---

### Get All Tasks

**GET** `/tasks`
Returns all tasks ordered by creation time.

---

### Update Task

**PUT** `/tasks/:id`

```json
{
  "status": "in-progress",
  "priority": "medium"
}
```

Supports partial updates.

---

### Delete Task

**DELETE** `/tasks/:id`
Returns `204 No Content` on success.

## Notes

* SQLite is used for simplicity and zero-config local persistence.
* Schema-level constraints ensure valid task states.
* Database is initialized automatically on server start.

```

---