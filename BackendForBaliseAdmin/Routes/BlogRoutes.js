import express from "express";
import upload from "../Middleware/Upload.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../Controllers/BlogController.js";
const BlogRouter = express.Router();

BlogRouter.post("/", upload.single("image"), createBlog);

BlogRouter.put("/:id", upload.single("image"), updateBlog);

BlogRouter.get("/", getAllBlogs);

BlogRouter.get("/:id", getBlogById);

BlogRouter.delete("/:id", deleteBlog);

export default BlogRouter;
