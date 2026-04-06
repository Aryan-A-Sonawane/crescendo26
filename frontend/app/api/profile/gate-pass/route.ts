import "@/lib/neon-client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildParticipantQrToken } from "@/lib/participant-qr";
import { normalizeEmail } from "@/lib/dashboard-auth";

const GATE_PASS_VALID_FROM = "2026-04-06";
const GATE_PASS_VALID_TO = "2026-04-09";

export async function GET(req: NextRequest) {
  try {
    const email = normalizeEmail(req.nextUrl.searchParams.get("email"));
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        phone: true,
        college: true,
        verified: true,
        createdAt: true,
      },
    });

    if (!registration || !registration.verified) {
      return NextResponse.json({ error: "Verified registration not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        pass: {
          participantName: registration.name,
          email: registration.email,
          phone: registration.phone,
          college: registration.college,
          qrToken: buildParticipantQrToken(registration.email),
          issuedAt: registration.createdAt.toISOString(),
          validFrom: GATE_PASS_VALID_FROM,
          validTo: GATE_PASS_VALID_TO,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[profile/gate-pass]", error);
    return NextResponse.json({ error: "Failed to build gate pass." }, { status: 500 });
  }
}
