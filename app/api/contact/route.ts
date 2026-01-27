import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { ContactSchema } from '@/lib/validation/contact';
import { getDateParts } from '@/lib/date';

import { treatmentRequests } from '@/db/schema/treatment_requests';
import { treatmentOfferings } from '@/db/schema/treatment_offerings';
import { treatmentTypes } from '@/db/schema/treatment_types';
import { treatmentVariants } from '@/db/schema/treatment_variants';

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

function formatEURFromCents(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export async function POST(req: Request) {
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
    const parsed = ContactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ungültige Eingabe.' },
        { status: 400 },
      );
    }

    const { date, time, name, email, message, phone, treatmentOfferingId } =
      parsed.data;

    // Build requestedAt (we keep it simple; later you can handle timezone explicitly)
    const requestedAt = new Date(`${date}T${time}:00`);

    // 1) Load offering + labels + price/duration from DB (source of truth)
    const rows = await db
      .select({
        offeringId: treatmentOfferings.id,
        priceCents: treatmentOfferings.priceCents,
        durationMin: treatmentOfferings.durationMin,

        treatmentLabel: treatmentTypes.label,
        variantLabel: treatmentVariants.label,
      })
      .from(treatmentOfferings)
      .innerJoin(
        treatmentTypes,
        eq(treatmentOfferings.treatmentTypeId, treatmentTypes.id),
      )
      .innerJoin(
        treatmentVariants,
        eq(treatmentOfferings.treatmentVariantId, treatmentVariants.id),
      )
      .where(
        and(
          eq(treatmentOfferings.id, treatmentOfferingId),
          eq(treatmentOfferings.isActive, true),
          eq(treatmentTypes.isActive, true),
          eq(treatmentVariants.isActive, true),
        ),
      )
      .limit(1);

    const offering = rows[0];
    if (!offering) {
      return NextResponse.json(
        { error: 'Diese Behandlung ist nicht (mehr) verfügbar.' },
        { status: 400 },
      );
    }

    // 2) Insert request with snapshots
    await db.insert(treatmentRequests).values({
      // If your Drizzle schema has defaults (recommended), omit id/createdAt.
      // If it requires them, add them back like you did before:
      // id: crypto.randomUUID(),
      // createdAt: new Date(),

      name,
      email,
      phone,
      requestedAt,
      message: message?.trim() ? message.trim() : null,
      status: 'new',

      treatmentOfferingId: offering.offeringId,
      priceSnapshotCents: offering.priceCents,
      durationSnapshotMin: offering.durationMin,

      // userId: null (later with Clerk)
    });

    // 3) Email
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

    const safeMessage = message?.trim() ? message.trim() : '(keine Nachricht)';
    const priceText = formatEURFromCents(offering.priceCents);

    const emailArgs: EmailArgs = {
      from,
      to,
      subject: `Terminanfrage am ${day}.${month}.${year} um ${time} Uhr`,
      text:
        `Datum: ${weekday}, ${day}. ${monthName} ${year} um ${time} Uhr\n` +
        `Behandlung: ${offering.treatmentLabel}\n` +
        `Variante: ${offering.variantLabel}\n` +
        `Preis: ${priceText}\n` +
        `Dauer: ${offering.durationMin} min\n\n` +
        `Name: ${name}\n` +
        `Telefon: ${phone}\n` +
        `E-Mail: ${email}\n\n` +
        `Nachricht:\n${safeMessage}\n`,
      replyTo: email.trim(),
    };

    await resend.emails.send(emailArgs);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('API /api/contact failed:', err);
    return NextResponse.json(
      { error: 'Senden fehlgeschlagen. Bitte erneut versuchen.' },
      { status: 500 },
    );
  }
}
