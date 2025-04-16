import express from "express";
import getCustomersByDateRange from "../Controllers/CustomerTabulerReport.js";

const router = express.Router();

router.get("/date-range", getCustomersByDateRange);

export default router;
