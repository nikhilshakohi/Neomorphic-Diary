import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import {
  authenticate,
  canSend,
  issueChallenge,
  newCode,
  setOtpCookie,
} from "@/app/lib/pinOtpServer";

export const runtime = "nodejs";

function smtpFailure(error: unknown) {
  const details =
    error && typeof error === "object"
      ? (error as { code?: string; responseCode?: number; command?: string })
      : {};
  console.error("PIN OTP email delivery failed", {
    code: details.code,
    responseCode: details.responseCode,
    command: details.command,
  });

  if (details.code === "EAUTH" || details.responseCode === 535) {
    return "Gmail rejected SMTP authentication. Check SMTP_USER and use a valid Google App Password.";
  }
  if (["ECONNECTION", "ESOCKET", "ETIMEDOUT"].includes(details.code ?? "")) {
    return "Could not connect to Gmail SMTP. Check the host, port, and secure setting.";
  }
  if (details.code === "EENVELOPE") {
    return "Gmail rejected the sender address. Use the authenticated Gmail address or a verified alias.";
  }
  return "Email delivery failed. Check the server log for the SMTP error code.";
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (char) => entities[char]);
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
      return NextResponse.json({ error: "Email delivery is not configured on the server." }, { status: 503 });
    }
    if (!process.env.PIN_OTP_SECRET || process.env.PIN_OTP_SECRET.length < 32) {
      return NextResponse.json({ error: "PIN OTP signing secret is not configured on the server." }, { status: 503 });
    }
    if (!canSend(user.uid)) {
      return NextResponse.json({ error: "Wait a minute before requesting another code." }, { status: 429 });
    }

    const code = newCode();
    const challenge = issueChallenge(user.uid, code);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true" || SMTP_PORT === "465",
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
    const address = SMTP_FROM.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] ?? SMTP_USER;
    const senderName = SMTP_FROM.split(/[<\[]/)[0].trim() || "Diary";
    await transporter.sendMail({
      from: { name: senderName, address },
      to: user.email,
      subject: "🔐 Your Diary PIN reset code",
      text: [
        `Hello ${user.displayName?.trim() || "there"},`,
        "",
        "We received a request to reset the PIN protecting your Diary. Enter this one-time code in the app to continue:",
        "",
        `     ${code}`,
        "",
        "This code expires in 10 minutes and can be tried up to 5 times. It only resets your Diary PIN; your sign-in password and diary entries are unchanged.",
        "",
        "If you did not request this, ignore this email. Your PIN will remain unchanged. Never share this code with anyone.",
        "",
        "Take care,\nYour Diary",
      ].join("\n"),
      html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your Diary PIN reset code</title></head>
<body style="margin:0;padding:24px 12px;background:#f2f4f7;font-family:Arial,Helvetica,sans-serif;color:#263238">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">Your one-time Diary PIN reset code expires in 10 minutes.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;background:#fff;border:1px solid #e5e9ef;border-radius:16px;overflow:hidden">
      <tr><td style="padding:26px 32px;background:#edf2ff;border-bottom:1px solid #e5e9ef">
        <div style="font-size:15px;font-weight:bold;letter-spacing:.04em;color:#4f46e5">📔 YOUR DIARY</div>
        <h1 style="margin:16px 0 6px;font-size:24px;line-height:1.3;color:#20283a">A little help getting back in 🔐</h1>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#5c667a">PIN reset verification</p>
      </td></tr>
      <tr><td style="padding:28px 32px 32px">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6">Hello ${escapeHtml(user.displayName?.trim() || "there")},</p>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#465166">We received a request to reset the PIN that protects your Diary. Enter this one-time code in the app to verify it’s you and choose a new PIN.</p>
        <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 22px"><tr><td style="padding:16px 28px;background:#f5f6fa;border:1px solid #e0e4ed;border-radius:12px;color:#3730a3;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center">${code}</td></tr></table>
        <p style="margin:0 0 22px;text-align:center;font-size:13px;line-height:1.6;color:#687386">⏳ Expires in 10 minutes · Up to 5 attempts</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 22px"><tr><td style="padding:15px 16px;background:#f7f9fc;border-left:3px solid #818cf8;border-radius:4px;font-size:14px;line-height:1.65;color:#465166"><strong>What this changes:</strong> only your Diary PIN. Your sign-in password and saved entries are not changed.</td></tr></table>
        <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#465166">If you didn’t request this code, you can safely ignore this email. Your PIN will stay as it is. For your privacy, never share this code with anyone.</p>
        <p style="margin:22px 0 0;font-size:14px;line-height:1.7;color:#465166">Take care,<br><strong>Your Diary</strong> ✨</p>
      </td></tr>
      <tr><td style="padding:16px 32px;background:#fafbfc;border-top:1px solid #edf0f4;font-size:12px;line-height:1.6;color:#8992a1">This is an automated security email for your personal diary. Please don’t reply to this message.</td></tr>
    </table>
  </td></tr></table>
</body></html>`,
    });

    const response = NextResponse.json({ ok: true });
    setOtpCookie(response, challenge);
    return response;
  } catch (error) {
    return NextResponse.json({ error: smtpFailure(error) }, { status: 502 });
  }
}
