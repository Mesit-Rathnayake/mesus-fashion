

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "MeSUS Fashion API is running"
    });
});

export default app;
