import express from "express";
import upload from "../Middleware/Upload.js";
import {
    createBlog,
    fetchAllBlogs,
    fetchBlogById,
} from "../controllers/blogController.js";

const BlogRouter = express.Router();

BlogRouter.post("/create", upload.single("bannerImage"), createBlog);

BlogRouter.get("/", fetchAllBlogs);

BlogRouter.get("/:id", fetchBlogById);

export default BlogRouter;