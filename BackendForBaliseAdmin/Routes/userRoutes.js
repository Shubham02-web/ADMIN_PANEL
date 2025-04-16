import express from "express";
const userRoutes = express.Router();
import {
  register,
  login,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";
import { authenticateToken, isAdmin } from "../Middleware/Auth.js";

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/users", getAllUsers);
userRoutes.get("/user/:id", getUserById);
// authenticateToken, isAdmin,
export default userRoutes;
