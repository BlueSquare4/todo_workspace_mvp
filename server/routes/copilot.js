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

  const raw = await runCopilot({ tasks, userMessage: message });

  const parsed = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();

  // If Copilot proposes a task → return proposal only
  if (parsed?.intent === "create_task") {
    return res.json({
      type: "task_proposal",
      task: parsed.task
    });
  }

  // Otherwise normal chat
  res.json({
    type: "message",
    response: raw
  });
});

module.exports = router;
