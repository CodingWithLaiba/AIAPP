/* eslint-env node */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ai", async (req, res) => {
  try {
    const userInput = req.body.input;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: userInput,
          options: { wait_for_model: true },
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.log("RAW ERROR:", text);
      return res.status(500).json({ error: "API failed" });
    }

    const data = JSON.parse(text);

    res.json(data);
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
