import express from "express";
import {
  getAllBookings,
  getBookingById,
  deleteBooking,
  createBooking,
} from "../Controllers/BookingController.js";

const router = express.Router();

router.post("/", createBooking);

router.get("/", getAllBookings);

router.get("/:id", getBookingById);

router.delete("/:id", deleteBooking);

export default router;
