import express from "express";
import { getContent, updateContent } from "../Controllers/contentController.js";

const router = express.Router();

// GET /get_content?content_type=0
router.get("/get_content", getContent);

// POST /update_content
router.post("/update_content", updateContent);

export default router;
