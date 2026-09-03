const KEY = import.meta.env.VITE_GEMINI_KEY;

const MODELS = [
  "gemini-3.6-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro",
];

function validateKey() {
  if (!KEY) throw new Error("Gemini API key not set. Add VITE_GEMINI_KEY to your .env file.");
}

async function tryModel(model, body) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error (${res.status}) with model ${model}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  return text;
}

async function callGemini(body) {
  validateKey();
  let lastError;
  for (const model of MODELS) {
    try {
      return await tryModel(model, body);
    } catch (err) {
      lastError = err;
      // Only retry if the error is "model not found", "not supported", or "no longer available"
      const msg = err.message.toLowerCase();
      if (!msg.includes("not found") &&
          !msg.includes("not supported") &&
          !msg.includes("no longer available")) {
        throw err; // auth/quota errors — don't retry other models
      }
    }
  }
  throw lastError;
}

/** Multi-turn chat */
export async function sendChatMessage(history, userMessage, systemContext) {
  const contents = [];

  if (systemContext && history.length === 0) {
    contents.push({ role: "user",  parts: [{ text: systemContext }] });
    contents.push({ role: "model", parts: [{ text: "Understood! I'm ready to help." }] });
  }

  history.forEach(m => contents.push({ role: m.role, parts: [{ text: m.text }] }));
  contents.push({ role: "user", parts: [{ text: userMessage }] });

  return callGemini({
    contents,
    generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
  });
}

/** Single-turn generation */
export async function generateContent(prompt) {
  return callGemini({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
  });
}

/** Structured itinerary */
export async function generateItinerary(destination, days = 5, preferences = "") {
  const prompt = `You are an expert travel planner. Create a detailed ${days}-day itinerary for ${destination.name}, ${destination.country}.
${preferences ? `Traveller preferences: ${preferences}` : ""}

Return ONLY valid JSON — no markdown fences, no explanation, just the raw JSON object:
{
  "destination": "${destination.name}",
  "days": ${days},
  "currency": "${destination.currency}",
  "bestTips": ["tip1", "tip2", "tip3"],
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "morning":   { "activity": "...", "description": "2-3 sentences.", "duration": "2 hours", "cost": "Free" },
      "afternoon": { "activity": "...", "description": "2-3 sentences.", "duration": "3 hours", "cost": "~€20" },
      "evening":   { "activity": "...", "description": "2-3 sentences.", "duration": "2 hours", "cost": "~€40" },
      "accommodation": "Area suggestion",
      "localTip": "One insider tip"
    }
  ]
}`;

  const raw = await generateContent(prompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Could not parse itinerary JSON from Gemini response.");
  try {
    return JSON.parse(match[0]);
  } catch {
    throw new Error("Gemini returned malformed JSON for the itinerary.");
  }
}
