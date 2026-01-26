import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactSchema } from '@/lib/validation/contact';
import { TREATMENT_LABELS } from '@/lib/constants/treatments';
import { getDateParts } from '@/lib/date';
import { db } from '@/db';
import { treatmentRequests } from '@/db/schema/treatmentRequests';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailArgs {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

const BUCKET = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = BUCKET.get(ip);

  if (!entry || now > entry.resetAt) {
    BUCKET.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= LIMIT) return { ok: false };
  entry.count += 1;
  return { ok: true };
}

export async function POST(req: Request) {
  console.log('CONTACT POST: start');
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (!rateLimit(ip).ok) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        { status: 429 },
      );
    }

    const json = await req.json();
    console.log('CONTACT POST: parsed body');
    const parsed = ContactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ungültige Eingabe.' },
        { status: 400 },
      );
    }

    const {
      date,
      time,
      name,
      email,
      message,
      phone,
      treatment,
      treatmentVariant,
    } = parsed.data;

    // DATABASE INSERT
    const requestedAt = date && time ? new Date(`${date}T${time}:00`) : null;

    await db.insert(treatmentRequests).values({
      name,
      email,
      treatment,
      treatmentVariant, // falls du’s schon im Schema hast
      requestedAt,
      message: message?.trim() ? message.trim() : null,
      status: 'new',
      // userId: null (später wenn Clerk da ist)
    });

    const dateParts = getDateParts(date);
    if (!dateParts) {
      return NextResponse.json({ error: 'Ungültiges Datum.' }, { status: 400 });
    }
    const { year, month, day, weekday, monthName } = dateParts;

    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!to || !from) {
      return NextResponse.json(
        { error: 'Server-Konfiguration fehlt.' },
        { status: 500 },
      );
    }

    const treatmentLabel = treatment
      ? (TREATMENT_LABELS[treatment] ?? treatment)
      : '(keine Behandlung ausgewählt)';
    const safeMessage = message?.trim() ? message.trim() : '(keine Nachricht)';

    const emailArgs: EmailArgs = {
      from,
      to,
      subject: `Terminanfrage am ${day}.${month}.${year} um ${time} Uhr`,
      text:
        `Datum: ${weekday}, ${day}. ${monthName} ${year} um ${time} Uhr\n` +
        `Behandlung: ${treatmentLabel}\n` +
        `Behandlungsvariante: ${treatmentVariant}\n` +
        `Name: ${name}\n` +
        `Telefon: ${phone}\n` +
        `E-Mail: ${email}\n\n\n` +
        `Nachricht:\n${safeMessage}\n`,
      replyTo: email.trim(),
    };
    console.log('CONTACT POST: before resend');
    await resend.emails.send(emailArgs);
    console.log('CONTACT POST: after resend');

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('API /api/contact failed:', err);
    return NextResponse.json(
      { error: 'Senden fehlgeschlagen. Bitte erneut versuchen.' },
      { status: 500 },
    );
  }
}
