# Task Workspace MVP with AI Copilot

A full-stack task/workspace application with an embedded AI Copilot that helps users plan, organize, and act on their tasks in a safe, production-minded way.

---

## Project Structure

```
├── frontend
├── server
    ├──db
        ├──index.js
    ├──routes
        ├──ai.js
        ├──copilot.js
        ├──tasks.js
    ├──services
        ├──llm.js
    ├──index.js
└── README.md

```

---

## Features Implemented

### Core Task Management
- Create tasks with:
  - Title (required)
  - Description (optional)
  - Status (todo / in-progress / done)
  - Priority (low / medium / high)
  - Due date (future dates only)
- View all tasks in a clean, responsive UI
- Update task status and priority directly from the task list
- Delete tasks with a confirmation modal to prevent accidental deletion
- Persistent storage using SQLite

---

### AI-Powered Enhancements (Copilot)

#### AI Task Assistance
- AI-generated **task title suggestions** while typing (debounced)
- Clickable AI suggestions to improve task titles
- Automatic AI-generated task description after selecting a title suggestion
- Suggestions close automatically on input blur

#### In-App AI Copilot Chat
- Floating Copilot button that expands into a chat panel
- Scrollable chat history
- Markdown-rendered AI responses
- Auto-scroll to the latest message
- Clear separation between AI suggestions and user actions

#### AI-Driven Task Creation
- Create tasks by prompting the Copilot in natural language
- Copilot infers:
  - Title
  - Description
  - Status
  - Priority
  - Due date (including relative dates)
- AI proposes task creation without auto-executing
- User confirmation required before task creation
- Confirmation message shown in chat after task is created

---

### Safety & UX Guardrails
- AI never mutates data without explicit user approval
- No destructive actions without confirmation
- Read-only AI context endpoints
- Defensive parsing of AI outputs
- Clear distinction between AI suggestions and system actions

---

## Backend API Overview

### Total Backend Endpoints: **8**

#### Task APIs
1. `GET /health` – Health check
2. `GET /tasks` – Fetch all tasks
3. `POST /tasks` – Create a new task
4. `PUT /tasks/:id` – Update task (status / priority / fields)
5. `DELETE /tasks/:id` – Delete task
6. `GET /tasks/context` – AI-safe, read-only task context

#### AI APIs
7. `POST /ai/task-suggestions` – AI title suggestions + description generation
8. `POST /copilot/ask` – Copilot reasoning and task proposal endpoint

---

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- react-markdown

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- Groq LLM

---

## Key Design Principles

- Small but complete MVP
- Product-first AI integration
- Human-in-the-loop for all state changes
- Clear separation of concerns (UI, API, AI)
- Defensive and predictable AI behavior

---

## Status

All core requirements and AI-driven enhancements have been implemented and integrated end-to-end.

