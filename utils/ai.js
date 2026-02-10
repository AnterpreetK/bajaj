import fetch from "node-fetch";

export async function askAI(question) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }]
      })
    }
  );

  const data = await res.json();

  // 🔒 SAFETY CHECKS (CRITICAL)
  if (
    !data ||
    !data.candidates ||
    !Array.isArray(data.candidates) ||
    data.candidates.length === 0 ||
    !data.candidates[0].content ||
    !data.candidates[0].content.parts ||
    data.candidates[0].content.parts.length === 0 ||
    !data.candidates[0].content.parts[0].text
  ) {
    throw new Error("AI service unavailable");
  }

  const text = data.candidates[0].content.parts[0].text;

  // Return single word only
  return text.trim().split(/\s+/)[0];
}
