import { NextRequest, NextResponse } from "next/server";
import {
  authenticate,
  clearOtpCookie,
  MAX_ATTEMPTS,
  nextChallenge,
  OTP_COOKIE,
  readChallenge,
  resetPinDocument,
  setOtpCookie,
  verifyCode,
} from "@/app/lib/pinOtpServer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

    const challenge = readChallenge(request.cookies.get(OTP_COOKIE)?.value);
    if (!challenge || challenge.uid !== user.uid) {
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }

    const { code } = (await request.json()) as { code?: string };
    const response = NextResponse.json({ ok: true });
    if (!code || !/^\d{6}$/.test(code) || !verifyCode(challenge, code)) {
      if (challenge.attempts + 1 >= MAX_ATTEMPTS) {
        const expired = NextResponse.json(
          { error: "Too many tries. Request a new code." },
          { status: 400 }
        );
        clearOtpCookie(expired);
        return expired;
      }
      const failed = NextResponse.json(
        { error: "That code is incorrect. Try again." },
        { status: 400 }
      );
      setOtpCookie(failed, nextChallenge(challenge));
      return failed;
    }

    await resetPinDocument(user.uid, user.idToken);
    clearOtpCookie(response);
    return response;
  } catch {
    return NextResponse.json({ error: "Could not verify the code. Please try again." }, { status: 500 });
  }
}
