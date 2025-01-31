import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./src/routes/auth";
import userRoutes from "./src/routes/user";
import emailRoutes from "./src/routes/email";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";

// configures dotenv to work in your application
dotenv.config({
  path: path.resolve(
    __dirname,
    process.env.ENV === "prod" ? "../.env" : "../.env.local"
  ),
});

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected to: ", conn.connection.host);
  } catch (error) {
    console.error("MongoDB Error: ", error);
  }
};

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FE_URL || ["http://localhost:3000"], // Update to your frontend URL
    credentials: true,
  })
);

// Register Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/email", emailRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
