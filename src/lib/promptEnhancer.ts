export function enhancePrompt(userInput: string) {
  const isTherapist = userInput.startsWith("[THERAPIST MODE]");

  if (isTherapist) {
    const message = userInput.replace("[THERAPIST MODE]", "").trim();
    return `
You are a compassionate, conversational therapist AI having a real-time chat with a user.

🧠 Stay calm, warm, and thoughtful.
💬 Keep your response under 3 sentences.
🎯 Never summarize or analyze unless the user asks.

User: "${message}"

Therapist:
    `;
  }

  // journal mode
  return `
You are an expert mental health assistant helping interpret someone's private journal entry.

Give a thoughtful but structured response with insights and helpful reflection prompts, like a therapist reading the journal and guiding them gently.

Entry: "${userInput}"

Insight:
  `;
}
