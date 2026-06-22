import type { Request, Response } from "express";
import { IntakeService } from "./intake.service";
import { ok, created, fail } from "~/api/api-response";
import { createLogger } from "~/lib/logger";

const logger = createLogger("IntakeController");

const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

/** POST /api/intake — public; patient submits the intake form. */
export async function submitIntake(req: Request, res: Response) {
  try {
    const { fullName, phone, dateOfBirth, reasonForVisit, notes } =
      (req.body ?? {}) as Record<string, unknown>;

    if (typeof fullName !== "string" || fullName.trim().length < 2) {
      return fail(res, "Please enter the patient's full name.");
    }
    if (typeof phone !== "string" || !PHONE_RE.test(phone.trim())) {
      return fail(res, "Please enter a valid mobile number.");
    }
    if (typeof reasonForVisit !== "string" || !reasonForVisit.trim()) {
      return fail(res, "Please select a reason for your visit.");
    }

    const intake = await IntakeService.create({
      fullName,
      phone,
      reasonForVisit,
      dateOfBirth:
        typeof dateOfBirth === "string" && dateOfBirth ? dateOfBirth : null,
      notes: typeof notes === "string" ? notes : "",
    });

    return created(
      res,
      {
        reference: intake.reference,
        status: intake.status,
        smsStatus: intake.smsStatus,
      },
      "Intake received",
    );
  } catch (error) {
    logger.error("Failed to submit intake:", error);
    return fail(res, "Could not submit intake. Please try again.", 500);
  }
}

/** GET /api/intake/queue — staff; returns the live queue. */
export async function getQueue(req: Request, res: Response) {
  try {
    const includeClosed = req.query.includeClosed === "true";
    const queue = await IntakeService.listQueue(includeClosed);
    return ok(res, queue);
  } catch (error) {
    logger.error("Failed to load queue:", error);
    return fail(res, "Could not load the queue.", 500);
  }
}

/** PATCH /api/intake/:id/status — staff; advance a patient's status. */
export async function updateIntakeStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = (req.body ?? {}) as Record<string, unknown>;

    if (typeof status !== "string") {
      return fail(res, "A status is required.");
    }

    const updated = await IntakeService.updateStatus(String(id), status);
    if (!updated) {
      return fail(res, "Intake not found.", 404);
    }
    return ok(res, updated, "Status updated");
  } catch (error) {
    const message =
      error instanceof Error && error.message.startsWith("Invalid status")
        ? error.message
        : "Could not update status.";
    const status = message.startsWith("Invalid status") ? 400 : 500;
    logger.error("Failed to update status:", error);
    return fail(res, message, status);
  }
}
