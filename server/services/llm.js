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

Rules:
- You may analyze tasks and suggest actions.
- You must NOT perform destructive actions.
- Any task creation or update must be proposed, not executed.
- Keep responses short, practical, and structured.

Task fields:
- title
- description
- status (todo | in-progress | done)
- priority (low | medium | high)
- dueDate (optional)
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
