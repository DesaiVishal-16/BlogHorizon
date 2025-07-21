import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db";
import app from "./app";

const PORT: number = Number(process.env.PORT || 5000);
const DB_URL: string = process.env.DB_URL || "";

if (!DB_URL) {
  console.error("Error: DB_URL is not defined in environment variables.");
  process.exit(1);
}

mongoose.set("strictQuery", false);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
