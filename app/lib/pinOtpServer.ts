import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

export const OTP_COOKIE = "pin-reset-otp";
const OTP_TTL = 10 * 60;
const SEND_INTERVAL = 60 * 1000;
const MAX_ATTEMPTS = 5;
const lastSent = new Map<string, number>();

type Challenge = { uid: string; digest: string; expires: number; attempts: number };

function secret() {
  const value = process.env.PIN_OTP_SECRET;
  if (!value || value.length < 32) throw new Error("PIN_OTP_SECRET must be at least 32 characters.");
  return value;
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function digest(uid: string, code: string) {
  return createHmac("sha256", secret()).update(`${uid}:${code}`).digest("hex");
}

export async function authenticate(request: NextRequest) {
  const idToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!idToken || !apiKey) return null;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!response.ok) return null;
  const data = (await response.json()) as {
    users?: Array<{ localId: string; email?: string; displayName?: string }>;
  };
  const user = data.users?.[0];
  return user?.localId && user.email
    ? { uid: user.localId, email: user.email, displayName: user.displayName, idToken }
    : null;
}

export function issueChallenge(uid: string, code: string) {
  const challenge: Challenge = {
    uid,
    digest: digest(uid, code),
    expires: Date.now() + OTP_TTL * 1000,
    attempts: 0,
  };
  const payload = Buffer.from(JSON.stringify(challenge)).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function readChallenge(value?: string): Challenge | null {
  if (!value) return null;
  const [payload, suppliedSignature] = value.split(".");
  if (!payload || !suppliedSignature) return null;
  const expected = Buffer.from(signature(payload));
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  try {
    const challenge = JSON.parse(Buffer.from(payload, "base64url").toString()) as Challenge;
    return challenge.expires > Date.now() && challenge.attempts < MAX_ATTEMPTS
      ? challenge
      : null;
  } catch {
    return null;
  }
}

export function verifyCode(challenge: Challenge, code: string) {
  const expected = Buffer.from(challenge.digest);
  const actual = Buffer.from(digest(challenge.uid, code));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function nextChallenge(challenge: Challenge) {
  const payload = Buffer.from(
    JSON.stringify({ ...challenge, attempts: challenge.attempts + 1 })
  ).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function newCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function canSend(uid: string) {
  const now = Date.now();
  for (const [key, time] of lastSent) if (now - time > SEND_INTERVAL) lastSent.delete(key);
  const previous = lastSent.get(uid);
  if (previous && now - previous < SEND_INTERVAL) return false;
  lastSent.set(uid, now);
  return true;
}

export function setOtpCookie(response: NextResponse, value: string) {
  response.cookies.set(OTP_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/pin",
    maxAge: OTP_TTL,
  });
}

export function clearOtpCookie(response: NextResponse) {
  response.cookies.set(OTP_COOKIE, "", { httpOnly: true, path: "/api/pin", maxAge: 0 });
}

export async function resetPinDocument(uid: string, idToken: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("Firebase project ID is not configured.");

  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${encodeURIComponent(uid)}`
  );
  url.searchParams.append("updateMask.fieldPaths", "pin");
  url.searchParams.append("updateMask.fieldPaths", "pinStatus");
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: { pin: { nullValue: "NULL_VALUE" }, pinStatus: { stringValue: "NEW" } },
    }),
  });
  if (!response.ok) throw new Error("Could not reset PIN record.");
}

export { MAX_ATTEMPTS };
