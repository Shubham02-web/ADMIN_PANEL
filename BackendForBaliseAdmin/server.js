import express from "express";
import { connectDB } from "./config/DB_Connect.js";
import userRoutes from "./Routes/userRoutes.js";
import customerRoutes from "./Routes/CustomerRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import BlogRouter from "./Routes/BlogRoutes.js";
import CategoryRoutes from "./Routes/CategoryRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/blog", BlogRouter);
app.use("/api/categories", CategoryRoutes);
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Welcome to the Admin Panel");
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
