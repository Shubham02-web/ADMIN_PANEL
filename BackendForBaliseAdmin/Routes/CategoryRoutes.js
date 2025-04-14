import express from "express";
const CategoryRoutes = express.Router();

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../Controllers/CategoryController.js";
import upload from "../Middleware/Upload.js";
// import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

// /api/categories
CategoryRoutes.post("/create", upload.single("CategoryImage"), createCategory);

CategoryRoutes.get("/", getAllCategories);

CategoryRoutes.get("/:id", getCategoryById);

CategoryRoutes.patch("/:id", upload.single("CategoryImage"), updateCategory);

CategoryRoutes.delete("/:id", deleteCategory);

export default CategoryRoutes;
