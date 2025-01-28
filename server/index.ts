import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
// import authRoutes from "./app/routes/auth";
// import userRoutes from "./app/routes/user";
import emailRoutes from "./routes/email";
// import bodyParser from "body-parser";
import path from "path";

// configures dotenv to work in your application
dotenv.config({
  path: path.resolve(
    __dirname,
    process.env.ENV === "prod" ? "../.env" : "../.env.local"
  ),
});

const app = express();
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FE_URL || ["http://localhost:3000"], // Update to your frontend URL
    credentials: true,
  })
);

// Register Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/email", emailRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
