import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js"
import geminiResponse from "./gemini.js";

const app = express();
app.use(cors({
    origin: "https://virtual-assistant-backend-crms.onrender.com",
    credentials: true,
}));
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", async (req, res) => {
  try {
    let prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    let data = await geminiResponse(prompt, "TestBot", "Admin");
    res.json(data);
  } catch (error) {
    console.error("Error in / route:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  connectDb();
  console.log(`Server is running at http://localhost:${port}`);
});
