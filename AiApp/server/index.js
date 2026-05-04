// /* eslint-env node */
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:5174",
//   }),
// );
// app.use(express.json());

// app.post("/", async (req, res) => {
//   console.log(req, res);
//   try {
//     const response = await fetch(
//       "https://api-inference.huggingface.co/hf/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.HF_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(req.body),
//       },
//     );
//     const text = await response.text();
//     console.log("RAW HF RESPONSE:", text);

//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch (e) {
//       return res.status(500).json({
//         error: "Invalid JSON from HF",
//         raw: text,
//       });
//     }

//     res.json(data);
//     console.log("API RESPONSE:", data);
//   } catch (error) {
//     console.error("SERVER ERROR:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
