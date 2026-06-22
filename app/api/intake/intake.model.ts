import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

/**
 * Lifecycle of a patient through the front desk.
 *  waiting   → submitted, not yet seen
 *  called    → staff has called them in
 *  in_progress → with a clinician
 *  completed → visit done
 *  cancelled → no-show / withdrawn
 */
export type IntakeStatus =
  | "waiting"
  | "called"
  | "in_progress"
  | "completed"
  | "cancelled";

export const INTAKE_STATUSES: IntakeStatus[] = [
  "waiting",
  "called",
  "in_progress",
  "completed",
  "cancelled",
];

export type SmsStatus = "pending" | "sent" | "failed" | "skipped";

@modelOptions({
  schemaOptions: {
    collection: "tbl_patient_intakes",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class PatientIntake extends CommonTypegooseEntity {
  /** Short human-friendly reference shown to patient + staff, e.g. "A4F2". */
  @prop({ type: String, required: true, index: true })
  reference!: string;

  @prop({ type: String, required: true })
  fullName!: string;

  /** E.164-ish phone string used for the SMS confirmation. */
  @prop({ type: String, required: true })
  phone!: string;

  @prop({ type: Date, required: false })
  dateOfBirth?: Date | null;

  @prop({ type: String, required: true })
  reasonForVisit!: string;

  @prop({ type: String, required: false, default: "" })
  notes!: string;

  @prop({ type: String, required: true, default: "waiting", index: true })
  status!: IntakeStatus;

  @prop({ type: String, required: true, default: "pending" })
  smsStatus!: SmsStatus;

  @prop({ type: String, required: false, default: "" })
  smsError!: string;
}

export const PatientIntakeModel = getModelForClass(PatientIntake);
