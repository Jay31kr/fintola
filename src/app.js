import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.routes.js"
import transactionRoutes from "./routes/transactions.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("API running");
});

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/transactions", transactionRoutes);





//error handler
app.use(errorHandler);

export { app }