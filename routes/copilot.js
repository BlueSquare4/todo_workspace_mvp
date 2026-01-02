const express = require("express");
const db = require("../db");
const { runCopilot } = require("../services/llm");

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const tasks = db.prepare(`
    SELECT id, title, description, status, priority, dueDate
    FROM tasks
    ORDER BY createdAt DESC
  `).all();

  const aiResponse = await runCopilot({
    tasks,
    userMessage: message
  });

  res.json({
    response: aiResponse,
    note: "AI suggestions only. No actions executed."
  });
});

module.exports = router;
