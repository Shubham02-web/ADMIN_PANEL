import express from "express";
import {
  deleteBroadcast,
  getAllBroadcasts,
  getAllCustomers,
  getBroadcastById,
  sendBroadcast,
} from "../Controllers/BrodcastController.js";
const router = express.Router();

router.post("/create", sendBroadcast);
router.get("/customers", getAllCustomers);
router.get("/broadcasts", getAllBroadcasts);
router.get("/broadcasts/:id", getBroadcastById);
router.delete("/broadcasts/:id", deleteBroadcast);

export default router;
