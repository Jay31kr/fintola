import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.routes.js"
import transactionRoutes from "./routes/transactions.routes.js";
import adminRoutes from "./routes/admin.routes.js"

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/admin" , adminRoutes);





//error handler
app.use(errorHandler);

export { app }
