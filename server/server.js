import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));
app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res
    .status(connected ? 200 : 503)
    .json({
      status: connected ? "ok" : "degraded",
      database: connected ? "connected" : "disconnected",
    });
});
app.use("/api/products", productRoutes);
app.use(
  "/api/contact",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
  contactRoutes,
);
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`API listening on port ${port}`),
);
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Stop the existing API process or set PORT to another available port.`,
    );
  } else {
    console.error(`API server failed to start (${error.code || error.name}).`);
  }
  process.exitCode = 1;
});

// Keep the HTTP API available while MongoDB is connecting. This lets the
// health check return a useful 503 and lets the database retry in the
// background instead of leaving the client with a proxy/network error.
void connectDB();
