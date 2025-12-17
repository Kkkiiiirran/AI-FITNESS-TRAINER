// server.ts
import express from "express";
import path from "path";
import { checkAndSend } from "./reminder"; // your reminder.ts file

const app = express();
const PORT = 3000;

// Basic route to confirm server is running
app.get("/", (req, res) => {
  res.send("AI Fitness Reminder Backend is running 🚀");
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);

  // Run reminder immediately
  await checkAndSend();

  // Then schedule it every minute
  setInterval(checkAndSend, 60 * 1000); // 60*1000 ms = 1 minute
});
