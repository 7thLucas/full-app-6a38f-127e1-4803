import { createLogger } from "~/lib/logger";

const logger = createLogger("SmsService");

export interface SmsSendResult {
  status: "sent" | "failed" | "skipped";
  error?: string;
}

/**
 * Render a template, replacing {name}, {clinic}, {reference} placeholders.
 */
export function renderSmsBody(
  template: string,
  vars: { name: string; clinic: string; reference: string },
): string {
  return template
    .replaceAll("{name}", vars.name)
    .replaceAll("{clinic}", vars.clinic)
    .replaceAll("{reference}", vars.reference);
}

/**
 * Send an SMS via the Twilio REST API using fetch (no SDK dependency).
 *
 * Credentials come from env:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
 *
 * If credentials are absent (e.g. local dev), the send is SKIPPED — the body
 * is logged so the flow stays fully testable without a Twilio account. The
 * patient intake still succeeds; only `smsStatus` reflects "skipped".
 */
export async function sendSms(to: string, body: string): Promise<SmsSendResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!accountSid || !authToken || !from) {
    logger.warn(
      `Twilio not configured — skipping SMS to ${to}. Body would be: "${body}"`,
    );
    return { status: "skipped" };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams({ To: to, From: from, Body: body });
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error(`Twilio send failed (${response.status}): ${text}`);
      return { status: "failed", error: `Twilio ${response.status}` };
    }

    logger.info(`SMS sent to ${to}`);
    return { status: "sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown SMS error";
    logger.error(`SMS send error: ${message}`);
    return { status: "failed", error: message };
  }
}
