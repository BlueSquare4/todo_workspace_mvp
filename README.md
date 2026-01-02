# Task Workspace MVP with AI Copilot

A full-stack task/workspace application with an embedded AI Copilot that helps users plan, organize, and act on their tasks in a safe, production-minded way.

---

## Project Structure

```

├── frontend
├── server
│   ├── db
│   │   └── index.js
│   ├── routes
│   │   ├── ai.js
│   │   ├── copilot.js
│   │   └── tasks.js
│   ├── services
│   │   └── llm.js
│   └── index.js
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
- Suggestions close automatically when the input loses focus

#### In-App AI Copilot Chat
- Floating Copilot button that expands into a chat panel
- Scrollable chat history with auto-scroll
- Markdown-rendered AI responses
- Clear visual separation between AI suggestions and user actions

#### AI-Driven Task Creation & Management
- Create tasks using natural language prompts
- Update tasks (status, priority, due date, description) via Copilot
- Delete tasks via Copilot with explicit confirmation
- Copilot infers:
  - Title
  - Description
  - Status
  - Priority
  - Due date (including relative dates like “tomorrow”)
- AI **never auto-executes** actions
- All create / update / delete operations require user confirmation
- Confirmation messages are shown inside the Copilot chat after actions

---

## Product & UX Thinking

### Copilot as a Product Feature
The Copilot is designed to feel like a **natural part of the product**, not a bolted-on chatbot. AI assistance appears only at moments where it reduces friction and adds clarity.

### When does AI assist automatically?
- While typing a task title, AI suggests clearer alternatives
- When a suggestion is selected, AI auto-generates a concise description
- In chat, AI interprets user intent into structured task proposals

### How does the user trust the AI?
- Every AI-initiated action is visible and reviewable
- Confirmation cards clearly show what will change
- Chat feedback confirms every successful action
- No hidden or background AI mutations

### How are unexpected or harmful actions avoided?
- AI never directly mutates application state
- All destructive actions (delete) require explicit confirmation
- Ambiguous requests trigger clarification instead of guessing
- AI operates strictly on provided task context and never invents task IDs

This separation ensures predictability, safety, and debuggability.

---

## Backend API Overview

### Total Backend Endpoints: **8**

#### Task APIs
1. `GET /health` – Health check  
2. `GET /tasks` – Fetch all tasks  
3. `POST /tasks` – Create a new task  
4. `PUT /tasks/:id` – Update task  
5. `DELETE /tasks/:id` – Delete task  
6. `GET /tasks/context` – AI-safe, read-only task context  

#### AI APIs
7. `POST /ai/task-suggestions` – AI title suggestions & description generation  
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

## Safety & Guardrails
- Human-in-the-loop for all state changes
- Defensive parsing of AI outputs
- No silent failures or background AI actions
- Clear distinction between AI suggestions and system execution


---

## Future Scope
- Task completion analytics (e.g., weekly summaries)
- Due-date reminders and notifications
- Multi-user workspaces and collaboration 

---

## Status

All core requirements, AI-driven features, and safety guardrails have been implemented and integrated end-to-end.
