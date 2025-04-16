import express from "express";
import {
  sendBroadcast,
  getCustomers,
} from "../Controllers/BrodcastController.js";
const router = express.Router();

router.post("/send_broadcast", sendBroadcast);
router.get("/customers", getCustomers);

export default router;
