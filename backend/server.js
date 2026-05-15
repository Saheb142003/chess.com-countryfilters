import express from "express";
import cors from "cors";
import chessRouter from "./routes/chessRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chess", chessRouter);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
