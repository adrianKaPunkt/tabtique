import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailArgs {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

// Input validation
const ContactSchema = z.object({
  name: z.string().min(2).max(30),
  email: z
    .string()
    .trim()
    .email('Ungültige E-Mail')
    .max(50)
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .min(6, 'Telefonnummer zu kurz')
    .max(20, 'Telefonnummer zu lang')
    .regex(/^[0-9+()\/\s-]+$/, 'Ungültige Telefonnummer'),
  message: z.string().min(10, 'Nachricht zu kurz.').max(1000),
});

// Limit
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

// POST

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
        { status: 429 }
      );
    }
    const json = await req.json();
    const parsed = ContactSchema.safeParse(json);

    if (!parsed.success) {
      console.error('Ungültige Eingabe.');
      return NextResponse.json(
        { error: 'Ungültige Eingabe.' },
        { status: 400 }
      );
    }

    const { name, email, message, phone } = parsed.data;

    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!to || !from) {
      console.error('Server-Konfiguration fehlt.');
      return NextResponse.json(
        { error: 'Server-Konfiguration fehlt.' },
        { status: 500 }
      );
    }

    const emailArgs: EmailArgs = {
      from,
      to,
      subject: `Kontaktanfrage von ${name} (${phone})`,
      text: `Name: ${name}\nTelefon: ${phone}\nE-Mail: ${
        email || '-'
      }\n\nNachricht:\n${message}\n`,
    };

    if (email && email.trim().length > 0) {
      emailArgs.replyTo = email.trim();
    }

    await resend.emails.send(emailArgs);

    console.log('SUCCESSSS');
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    console.error('Senden fehlgeschlagen. Bitte erneut versuchen.');
    return NextResponse.json(
      { error: 'Senden fehlgeschlagen. Bitte erneut versuchen.' },
      { status: 500 }
    );
  }
}
