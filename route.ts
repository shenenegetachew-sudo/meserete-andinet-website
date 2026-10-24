import { createHash, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmailFrom, getResend } from "@/lib/email";

export const runtime = "nodejs";

function hashCode(email: string, code: string) {
  return createHash("sha256").update(`${email.toLowerCase()}:${code}:${process.env.OTP_PEPPER || "change-this-in-production"}`).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 100) : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "ትክክለኛ የኢሜይል አድራሻ ያስገቡ።" }, { status: 400 });
    }
    if (fullName.length < 2) {
      return NextResponse.json({ error: "ሙሉ ስምዎን ያስገቡ።" }, { status: 400 });
    }

    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "ይህ ኢሜይል አስቀድሞ በአባልነት ተመዝግቧል።" }, { status: 409 });

    const prior = await prisma.otpVerification.findUnique({ where: { email } });
    if (prior && Date.now() - prior.createdAt.getTime() < 60_000) {
      return NextResponse.json({ error: "አዲስ ኮድ ከመጠየቅዎ በፊት አንድ ደቂቃ ይጠብቁ።" }, { status: 429 });
    }

    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.otpVerification.upsert({
      where: { email },
      create: { email, codeHash: hashCode(email, code), expiresAt, attempts: 0 },
      update: { codeHash: hashCode(email, code), expiresAt, attempts: 0, createdAt: new Date() },
    });

    const resend = getResend();
    const result = await resend.emails.send({
      from: getEmailFrom(),
      to: [email],
      subject: "የመሠረተ አንድነት የኢሜይል ማረጋገጫ ኮድ",
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#173b32"><h2>እንኳን ወደ መሠረተ አንድነት በደህና መጡ!</h2><p>ሰላም ${escapeHtml(fullName)},</p><p>የአባልነት ምዝገባዎን ለመቀጠል የሚከተለውን ኮድ ያስገቡ፦</p><div style="font-size:32px;letter-spacing:8px;font-weight:bold;background:#edf3e8;padding:20px;text-align:center;border-radius:10px">${code}</div><p>ይህ ኮድ ለ10 ደቂቃ ብቻ ይሰራል። እርስዎ ካልጠየቁት ኢሜይሉን ችላ ይበሉ።</p></div>`,
    });
    if (result.error) {
      await prisma.otpVerification.delete({ where: { email } }).catch(() => undefined);
      console.error("Resend send error:", result.error);
      return NextResponse.json({ error: "ኢሜይሉን መላክ አልተቻለም። የResend እና EMAIL_FROM ቅንብር ይፈትሹ።" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json({ error: "የኢሜይል አገልግሎቱ አልተዘጋጀም። የserver ቅንብሮችን ይፈትሹ።" }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] || char));
}
