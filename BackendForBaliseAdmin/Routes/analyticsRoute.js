// routes/analyticsRoute.js
import express from "express";
import {
  demographics,
  monthly,
  yearly,
} from "../Controllers/analyticsController.js";

const router = express.Router();

// use these API Address rpute ${Url}/api/analytics/routeEndPointDiffrentForEveryRequest

router.get("/monthly", monthly);
router.get("/yearly", yearly);
router.get("/demographics", demographics);
export default router;
