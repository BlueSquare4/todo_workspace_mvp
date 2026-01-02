const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function runCopilot({ tasks, userMessage }) {
  const systemPrompt = `
You are an in-app AI copilot for a task management product.

Today is ${new Date().toISOString().split("T")[0]}.

Rules:
- You may analyze tasks and suggest actions.
- You must NOT execute actions.
- ALL actions must be proposed and require user confirmation.
- Respond with ONLY valid JSON when proposing an action.
- No markdown. No explanations.

Available intents:

1) Create task
{
  "intent": "create_task",
  "task": {
    "title": string,
    "description": string,
    "status": "todo" | "in-progress" | "done",
    "priority": "low" | "medium" | "high",
    "dueDate": "YYYY-MM-DD | null"
  }
}

2) Update task
{
  "intent": "update_task",
  "taskId": string,
  "updates": {
    "title"?: string,
    "description"?: string,
    "status"?: "todo" | "in-progress" | "done",
    "priority"?: "low" | "medium" | "high",
    "dueDate"?: "YYYY-MM-DD | null"
  }
}

3) Delete task
{
  "intent": "delete_task",
  "taskId": string
}

4) Break task into subtasks
{
  "intent": "break_into_subtasks",
  "taskId": string,
  "subtasks": [
    {
      "title": string,
      "description": string
    }
  ]
}

Rules for task identification:
- Always infer taskId from the provided task list.
- If multiple tasks match, ask the user to clarify instead of guessing.
- Never invent task IDs.


Rules for breaking into subtasks:
- Generate 3–6 actionable subtasks
- Subtasks should be concrete and sequential
- Do not create subtasks automatically
- If the task is already specific, say so instead of forcing subtasks


If no action is intended, respond with normal conversational text.
`;


  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `
User request:
${userMessage}

Current tasks:
${JSON.stringify(tasks, null, 2)}
        `,
      },
    ],
  });

  return response.choices[0].message.content;
}

async function generateTaskSuggestions(title) {
  const systemPrompt = `
You help users create clear, actionable tasks.

Rules:
- Improve clarity, not verbosity
- Keep titles short and professional
- Description should be 1–2 sentences max
- Do not invent deadlines or priorities
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `
Given this task title:
"${title}"

Return:
1) 3 improved task title suggestions
2) 1 short task description

Respond in JSON with keys:
- titleSuggestions (array of strings)
- generatedDescription (string)
        `,
      },
    ],
  });

  // Parse JSON safely
  const raw = response.choices[0].message.content;
  const parsed = extractJSON(raw);

  return (
    parsed || {
      titleSuggestions: [],
      generatedDescription: "",
    }
  );
}

module.exports = { runCopilot, generateTaskSuggestions };
