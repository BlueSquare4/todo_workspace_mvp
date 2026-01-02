require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { runCopilot } = require("./services/llm");
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(cors());
app.use(express.json());

// Test AI endpoint
app.get("/test-ai", async (_, res) => {
  const output = await runCopilot({
    tasks: [],
    userMessage: "Summarize my tasks"
  });
  res.json({ output });
});
app.use("/tasks", taskRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
