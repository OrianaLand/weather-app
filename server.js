import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch"; // or remove if using Node 18+ (we have Node 22, so we can use global fetch)

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

if (!API_KEY) {
  console.error("ERROR: WEATHER_API_KEY is not set in .env");
  process.exit(1);
}

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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
