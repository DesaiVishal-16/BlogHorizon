import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors';
import postRoutes from "./routes/postRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import { errorHandler } from "./middlewares/error";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { commentRoutes } from "./routes/commentRoutes";

const app: Application = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');

if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

const staticPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', staticPath);
app.use('/uploads', express.static(staticPath));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/protected', protectedRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('404 for:', req.method, req.url);
    res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

export default app;