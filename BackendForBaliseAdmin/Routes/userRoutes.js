import express from "express";
const userRoutes = express.Router();
import { register, login, getAllUsers } from "../controllers/userController.js";
import { authenticateToken, isAdmin } from "../Middleware/Auth.js";

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/users", getAllUsers);
// authenticateToken, isAdmin,
export default userRoutes;