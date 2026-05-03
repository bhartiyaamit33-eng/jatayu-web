import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getPayloadClient } from "@/lib/payload";

type TrialPayload = {
  fullName?: string;
  workEmail?: string;
  phone?: string;
  role?: string;
  specialty?: string;
  hospitalOrCompany?: string;
  country?: string;
  password?: string;
};

const allowedRoles = ["doctor", "hospital_admin", "ehr_partner", "other"] as const;

export async function POST(request: Request) {
  let body: TrialPayload;
  try {
    body = (await request.json()) as TrialPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const required = [
    body.fullName,
    body.workEmail,
    body.phone,
    body.role,
    body.hospitalOrCompany,
    body.country,
    body.password,
  ];

  if (required.some((v) => !v || String(v).trim() === "")) {
    return NextResponse.json(
      { ok: false, error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  if (!body.role || !allowedRoles.includes(body.role as (typeof allowedRoles)[number])) {
    return NextResponse.json({ ok: false, error: "Invalid role." }, { status: 400 });
  }

  try {
    const payload = await getPayloadClient();

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "";
    const userAgent = request.headers.get("user-agent") ?? "";

    await payload.create({
      collection: "leads",
      data: {
        fullName: String(body.fullName).trim(),
        workEmail: String(body.workEmail).trim().toLowerCase(),
        phone: String(body.phone).trim(),
        role: body.role as (typeof allowedRoles)[number],
        specialty: body.specialty?.trim() || undefined,
        hospitalOrCompany: String(body.hospitalOrCompany).trim(),
        country: String(body.country).trim(),
        status: "new",
        source: "trial-form",
        consent: {
          termsAcceptedAt: new Date().toISOString(),
          ip,
          userAgent,
        },
      },
    });

    revalidateTag("leads", "max");

    // TODO: enqueue Gmail SMTP welcome + drip scheduler. Sales notification handled
    // by reading new leads from /admin or via a Payload afterChange hook.

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead persist failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: "We could not submit your request right now. Please try again or email sales@jatayuhealth.com.",
      },
      { status: 500 },
    );
  }
}
