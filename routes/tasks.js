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

module.exports = router;
