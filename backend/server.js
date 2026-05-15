import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chessRouter from "./routes/chessRoutes.js";

dotenv.config();

const app = express();
// Render provides PORT, but we keep 5000 for your local testing
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST"],
  }),
);

app.use(express.json());
app.use("/api/chess", chessRouter);

// Health check for Render
app.get("/", (req, res) => {
  res.send("Chess Analysis Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
