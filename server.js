import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, "dist")));

// API route
app.get("/api/weather", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res.status(400).json({ error: "Missing q parameter (city)" });

    const url = `${BASE_URL}${encodeURIComponent(q)}?key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Serve index.html for all other routes (SPA support)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
