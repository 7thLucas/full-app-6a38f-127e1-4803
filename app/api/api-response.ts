import type { Response } from "express";

/**
 * Standard API response envelope used by every controller in this app.
 * Mirrors the client-side `ApiResponse<T>` shape in `~/lib/api.client.ts`
 * so the axios wrapper can read `success`, `data`, `message`, `error`.
 */
export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export function ok<T>(res: Response, data: T, message?: string, status = 200) {
  const body: ApiEnvelope<T> = { success: true, data, message };
  return res.status(status).json(body);
}

export function created<T>(res: Response, data: T, message?: string) {
  return ok(res, data, message, 201);
}

export function fail(
  res: Response,
  message: string,
  status = 400,
  error?: string,
) {
  const body: ApiEnvelope = { success: false, message, error };
  return res.status(status).json(body);
}
