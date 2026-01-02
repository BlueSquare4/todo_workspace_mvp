const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

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
        `
      }
    ]
  });

  return response.choices[0].message.content;
}

module.exports = { runCopilot };
