import express from "express";
import {
  addMessage,
  getAllMessage,
  getMessageById,
  updateMessage,
} from "../Controllers/MessageController.js";
const MessageRouter = express.Router();

MessageRouter.post("/", addMessage);

MessageRouter.get("/", getAllMessage);

MessageRouter.get("/:id", getMessageById);

MessageRouter.put("/:id", updateMessage);

export default MessageRouter;
