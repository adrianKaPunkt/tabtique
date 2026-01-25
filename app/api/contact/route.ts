import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  ContactSchema,
  type ContactFormValues,
  TREATMENTS,
} from '@/lib/validation/contact';

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

//' Limiting function
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
//' ---

/**
 * 'Contact form handler
 * @param req Request
 * @returns NextResponse
 */
export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const rl = rateLimit(ip);
    if (!rl.ok) {
      console.error('Zu viele Anfragen. Bitte später erneut versuchen.');
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        { status: 429 },
      );
    }
    const json = await req.json();
    const parsed = ContactSchema.safeParse(json);

    if (!parsed.success) {
      console.error('Ungültige Eingabe.');
      return NextResponse.json(
        { error: 'Ungültige Eingabe.' },
        { status: 400 },
      );
    }

    const { name, email, message, phone, treatment } = parsed.data;

    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!to || !from) {
      console.error('Server-Konfiguration fehlt.');
      return NextResponse.json(
        { error: 'Server-Konfiguration fehlt.' },
        { status: 500 },
      );
    }

    const emailArgs: EmailArgs = {
      from,
      to,
      subject: `Terminanfrage für ${TREATMENTS.find((t) => t.key === treatment)?.name || treatment}`,
      text: `Behandlung: ${TREATMENTS.find((t) => t.key === treatment)?.name || treatment}\nName: ${name}\nTelefon: ${phone}\nE-Mail: ${email}\n\n\nNachricht:\n${message}\n`,
    };

    if (email && email.trim().length > 0) {
      emailArgs.replyTo = email.trim();
    }

    await resend.emails.send(emailArgs);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    console.error('Senden fehlgeschlagen. Bitte erneut versuchen.');
    return NextResponse.json(
      { error: 'Senden fehlgeschlagen. Bitte erneut versuchen.' },
      { status: 500 },
    );
  }
}
