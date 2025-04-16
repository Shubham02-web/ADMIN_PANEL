import express from "express";
const userRoutes = express.Router();
import {
  register,
  login,
  getAllUsers,
  getUserById,
  updatePassword,
  updateUser,
} from "../controllers/userController.js";
import { authenticateToken, isAdmin } from "../Middleware/Auth.js";
import upload from "../Middleware/Upload.js";

userRoutes.post("/register", upload.single("image"), register);
userRoutes.post("/login", login);
userRoutes.get("/users", getAllUsers);
userRoutes.get("/user/:id", getUserById);
userRoutes.put("/user/:id", upload.single("image"), updateUser);
userRoutes.put("/user/:id", updatePassword);
export default userRoutes;
