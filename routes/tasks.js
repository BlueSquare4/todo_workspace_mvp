const express = require("express");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();

// Get all tasks
router.get("/", (_, res) => {
  const tasks = db.prepare("SELECT * FROM tasks ORDER BY createdAt DESC").all();
  res.json(tasks);
});

// Create task
router.post("/", (req, res) => {
  const {
    title,
    description = "",
    status = "todo",
    priority = "medium",
    dueDate = null
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = {
    id: crypto.randomUUID(),
    title,
    description,
    status,
    priority,
    dueDate,
    createdAt: new Date().toISOString()
  };

  db.prepare(`
    INSERT INTO tasks (id, title, description, status, priority, dueDate, createdAt)
    VALUES (@id, @title, @description, @status, @priority, @dueDate, @createdAt)
  `).run(task);

  res.status(201).json(task);
});

// Update task
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  const existingTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  if (!existingTask) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updatedTask = {
    title: title ?? existingTask.title,
    description: description ?? existingTask.description,
    status: status ?? existingTask.status,
    priority: priority ?? existingTask.priority,
    dueDate: dueDate ?? existingTask.dueDate,
    id
  };

  db.prepare(`
    UPDATE tasks
    SET
      title = @title,
      description = @description,
      status = @status,
      priority = @priority,
      dueDate = @dueDate
    WHERE id = @id
  `).run(updatedTask);

  res.json({ ...existingTask, ...updatedTask });
});

// Delete task
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const result = db
    .prepare("DELETE FROM tasks WHERE id = ?")
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(204).send();
});


module.exports = router;
