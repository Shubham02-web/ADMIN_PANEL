import express from "express";
import { getContent, updateContent } from "../Controllers/contentController.js";

const router = express.Router();

router.get("/get_content", getContent);
router.post("/update_content", updateContent);

export default router;
