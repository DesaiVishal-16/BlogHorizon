import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import { errorHandler } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { commentRoutes } from "./routes/commentRoutes.js";

const app: Application = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/protected", protectedRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("404 for:", req.method, req.url);
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

export default app;
