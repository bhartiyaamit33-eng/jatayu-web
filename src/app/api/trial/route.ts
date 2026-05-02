import { NextResponse } from "next/server";
import { siteMeta } from "@/content/site-config";

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

  const allowedRoles = ["doctor", "hospital_admin", "ehr_partner", "other"];
  if (!body.role || !allowedRoles.includes(body.role)) {
    return NextResponse.json({ ok: false, error: "Invalid role." }, { status: 400 });
  }

  // TODO: Persist to Postgres, enqueue Gmail SMTP + drip scheduler, notify sales.
  if (process.env.NODE_ENV !== "production") {
    console.info("[trial signup]", {
      ...body,
      password: "[redacted]",
      salesEmail: siteMeta.salesEmail,
    });
  }

  return NextResponse.json({
    ok: true,
    received: true,
  });
}
