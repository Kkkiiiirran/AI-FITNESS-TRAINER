// reminder.ts
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// --- Gemini setup ---
const ai = new GoogleGenAI({
  apiKey: process.env.VITE_GEMINI_API_KEY!,
});

// --- Nodemailer setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
  },
});

// --- User type ---
interface User {
  name: string;
  email: string;
  lastExercise: Date;
}

// Example users
const users: User[] = [
  { name: "Kiran", email: "itskkirran@gmail.com", lastExercise: new Date("2025-11-25T10:00:00") },
  { name: "Lavanya", email: "itskkirran@gmail.com", lastExercise: new Date("2025-11-24T09:00:00") },
];

// GIF links
const GIF_URLS = [
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmwxNWIzZnFvNTkzaG9rM2o4Nm0wdmRnOGo0dXE0dW12cGh3jEu24/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgzaTVuenB4eTcyajRjbDgxc2UxZTU3Ynk5MHN5a2FtamtvMGFxZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YkIdQAe4H1cLTOkByI/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMThnbHh5cHJkbThiMm85YnppbWRqMHdvcXkxbnFiZmpqMjZnMWZkNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4V3RuU0zSq1SC8Hh4x/giphy.gif",
  "https://tenor.com/view/milk-and-mocha-sad-crying-gif-18191422",
];

const pickRandomGif = () => GIF_URLS[Math.floor(Math.random() * GIF_URLS.length)];

const hoursSince = (date: Date) => (new Date().getTime() - date.getTime()) / 1000 / 60 / 60;

const getMotivationMessage = async (user: User, hours: number) => {
  try {
    const prompt = `
Write a short, emotional, slightly sad motivational notice
for ${user.name} who hasn't exercised in ${hours} hours.
Make it empathetic, gentle but encouraging. 2-3 sentences only.
`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || `Hey ${user.name}, your body misses you — let's move today!`;
  } catch (err) {
    console.error("Gemini Error:", err);
    return `Hey ${user.name}, your body misses you — let's move today!`;
  }
};

const buildHtmlBody = (user: User, message: string, hours: number, gifUrl: string) => `
<div style="font-family:Arial,sans-serif; max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:10px;">
  <h2 style="text-align:center;">We Miss You, ${user.name} 🥺</h2>
  <div style="text-align:center; margin:20px 0;">
    <img src="${gifUrl}" style="max-width:100%; border-radius:8px;" />
  </div>
  <p>${message}</p>
  <p><em>It's been about ${hours} hours since your last workout.</em></p>
  <p style="margin-top:30px; font-size:14px; color:#777; text-align:center;">Your AI Fitness Trainer 💪</p>
</div>
`;

const sendReminder = async (user: User, message: string, hours: number) => {
  const html = buildHtmlBody(user, message, hours, pickRandomGif());
  try {
    await transporter.sendMail({
      from: `"Your AI Trainer" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: `We miss you at the gym, ${user.name}…`,
      html,
      text: `${message}\n\nIt's been ${hours} hours since your last workout. We miss you!`,
    });
    console.log(`Email sent to ${user.email}`);
  } catch (err) {
    console.error(`Error sending email to ${user.email}`, err);
  }
};

export const checkAndSend = async () => {
  console.log("Checking users at", new Date().toLocaleTimeString());
  for (const user of users) {
    const hours = Math.floor(hoursSince(user.lastExercise));
    if (hours > 0) {
      const msg = await getMotivationMessage(user, hours);
      await sendReminder(user, msg, hours);
    }
  }
};

// Run immediately and then every minute
(async () => {
  await checkAndSend();
  setInterval(checkAndSend, 60 * 1000); // 60*1000 = 1 minute
})();
