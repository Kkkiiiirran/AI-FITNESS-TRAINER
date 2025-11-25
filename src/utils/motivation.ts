// src/utils/motivation.ts

export async function fetchMotivation(reps: number): Promise<string> {
  try {
    const response = await fetch("https://api.gemini.ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Give a short motivational message for completing ${reps} exercise reps`,
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    return data.text || "Keep going! 💪";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Keep pushing! 💪";
  }
}
