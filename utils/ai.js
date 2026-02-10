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
  const text = data.candidates[0].content.parts[0].text;

  return text.trim().split(/\s+/)[0];
}
