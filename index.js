require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const { runCopilot } = require("./services/llm");
const taskRoutes = require("./routes/tasks");
const copilotRoutes = require("./routes/copilot");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/copilot", copilotRoutes);
app.use("/tasks", taskRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
