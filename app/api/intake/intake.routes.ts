import { Router } from "express";
import {
  submitIntake,
  getQueue,
  updateIntakeStatus,
} from "./intake.controller";

const router = Router();

// Public — patients submit from their phone.
router.post("/intake", submitIntake);

// Staff queue operations.
router.get("/intake/queue", getQueue);
router.patch("/intake/:id/status", updateIntakeStatus);

export default router;
