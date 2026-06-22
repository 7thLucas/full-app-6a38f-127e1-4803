import { randomBytes } from "node:crypto";
import { PatientIntakeModel, INTAKE_STATUSES } from "./intake.model";
import type { IntakeStatus } from "./intake.model";
import { renderSmsBody, sendSms } from "./sms.service";
import { ConfigurablesService } from "~/modules/configurables/src/services/configurables.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger("IntakeService");

const DEFAULT_SMS_TEMPLATE =
  "Hi {name}, your check-in at {clinic} is confirmed. Reference: {reference}.";

export interface CreateIntakeInput {
  fullName: string;
  phone: string;
  dateOfBirth?: string | null;
  reasonForVisit: string;
  notes?: string;
}

/** 4-char uppercase reference, e.g. "A4F2". Avoids ambiguous 0/O/1/I. */
function generateReference(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(4);
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

function isValidStatus(value: unknown): value is IntakeStatus {
  return typeof value === "string" && INTAKE_STATUSES.includes(value as IntakeStatus);
}

export class IntakeService {
  /**
   * Persist a new intake, then fire the SMS confirmation. SMS failures never
   * fail the intake — they're recorded on the document instead.
   */
  static async create(input: CreateIntakeInput) {
    const reference = generateReference();

    const intake = await PatientIntakeModel.create({
      reference,
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
      reasonForVisit: input.reasonForVisit.trim(),
      notes: (input.notes ?? "").trim(),
      status: "waiting",
      smsStatus: "pending",
      smsError: "",
    });

    // Pull owner-configured clinic name + SMS template from configurables.
    let clinic = "our clinic";
    let template = DEFAULT_SMS_TEMPLATE;
    try {
      const config = (await ConfigurablesService.getData()) as Record<string, unknown>;
      if (typeof config.appName === "string" && config.appName.trim()) {
        clinic = config.appName.trim();
      }
      if (
        typeof config.smsConfirmationTemplate === "string" &&
        config.smsConfirmationTemplate.trim()
      ) {
        template = config.smsConfirmationTemplate;
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      logger.warn(`Could not read configurables for SMS; using defaults: ${reason}`);
    }

    const body = renderSmsBody(template, {
      name: intake.fullName,
      clinic,
      reference,
    });

    const result = await sendSms(intake.phone, body);
    intake.smsStatus = result.status;
    intake.smsError = result.error ?? "";
    await intake.save();

    return intake;
  }

  /**
   * The staff queue. Active patients (waiting/called/in_progress) first, oldest
   * first so the front of the line is the longest-waiting. `includeClosed`
   * appends completed/cancelled for the day.
   */
  static async listQueue(includeClosed = false) {
    const filter: Record<string, unknown> = { deletedAt: null };
    if (!includeClosed) {
      filter.status = { $in: ["waiting", "called", "in_progress"] };
    }
    return PatientIntakeModel.find(filter).sort({ createdAt: 1 }).lean().exec();
  }

  static async updateStatus(id: string, status: string) {
    if (!isValidStatus(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return PatientIntakeModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true },
    )
      .lean()
      .exec();
  }
}
