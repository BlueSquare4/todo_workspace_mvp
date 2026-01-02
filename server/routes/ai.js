const express = require("express");
const { generateTaskSuggestions } = require("../services/llm");

const router = express.Router();

router.post("/task-suggestions", async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const suggestions = await generateTaskSuggestions(title.trim());
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

module.exports = router;
