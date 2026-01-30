import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { ContactSchema } from '@/lib/validation/contact';
import { getDateParts } from '@/lib/date';

import { treatmentRequests } from '@/db/schema/treatment_requests';
import { treatmentRequestAddons } from '@/db/schema/treatment_request_addons';

import { treatmentOfferings } from '@/db/schema/treatment_offerings';
import { treatmentTypes } from '@/db/schema/treatment_types';
import { treatmentVariants } from '@/db/schema/treatment_variants';

import { treatmentOfferingAddons } from '@/db/schema/treatment_offering_addons';
import { treatmentAddons } from '@/db/schema/treatment_addons';

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

    const {
      date,
      time,
      name,
      email,
      message,
      phone,
      treatmentOfferingId,
      selectedAddonCodes = [],
    } = parsed.data;

    // requested_at is NOT NULL in your SQL
    const requestedAt = new Date(`${date}T${time}:00`);

    // 1) Load offering (source of truth)
    const offeringRows = await db
      .select({
        offeringId: treatmentOfferings.id,
        basePriceCents: treatmentOfferings.priceCents,
        baseDurationMin: treatmentOfferings.durationMin,

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

    const offering = offeringRows[0];
    if (!offering) {
      return NextResponse.json(
        { error: 'Diese Behandlung ist nicht (mehr) verfügbar.' },
        { status: 400 },
      );
    }

    // 2) Load addon rules for this offering
    const addonRuleRows = await db
      .select({
        addonCode: treatmentAddons.code,
        addonLabel: treatmentAddons.label,
        addonIsActive: treatmentAddons.isActive,

        isIncluded: treatmentOfferingAddons.isIncluded,
        isOptional: treatmentOfferingAddons.isOptional,

        priceDeltaCents: treatmentOfferingAddons.priceDeltaCents,
        durationDeltaMin: treatmentOfferingAddons.durationDeltaMin,
      })
      .from(treatmentOfferingAddons)
      .innerJoin(
        treatmentAddons,
        eq(treatmentAddons.id, treatmentOfferingAddons.treatmentAddonId),
      )
      .where(
        eq(treatmentOfferingAddons.treatmentOfferingId, offering.offeringId),
      );

    // Filter inactive addons out
    const activeRules = addonRuleRows.filter((r) => r.addonIsActive !== false);

    // 3) Decide which addons apply: included always, optional only if selected
    const included = activeRules.filter((r) => r.isIncluded);
    const optional = activeRules.filter((r) => r.isOptional && !r.isIncluded);

    // only allow optional addons that exist on this offering
    const selectedOptional = optional.filter((r) =>
      selectedAddonCodes.includes(r.addonCode),
    );

    const appliedAddons = [...included, ...selectedOptional];

    // 4) Compute totals
    const addonsPriceDelta = appliedAddons.reduce(
      (sum, a) => sum + (a.priceDeltaCents ?? 0),
      0,
    );
    const addonsDurationDelta = appliedAddons.reduce(
      (sum, a) => sum + (a.durationDeltaMin ?? 0),
      0,
    );

    const totalPriceCents = offering.basePriceCents + addonsPriceDelta;
    const totalDurationMin = offering.baseDurationMin + addonsDurationDelta;

    // 5) Insert request (totals as snapshots)
    const inserted = await db
      .insert(treatmentRequests)
      .values({
        name,
        email,
        phone,
        requestedAt,
        message: message?.trim() ? message.trim() : null,
        status: 'requested',

        treatmentOfferingId: offering.offeringId,
        priceSnapshotCents: totalPriceCents,
        durationSnapshotMin: totalDurationMin,

        // userId: null (later)
      })
      .returning({ id: treatmentRequests.id });

    const requestId = inserted[0]?.id;
    if (!requestId) {
      return NextResponse.json(
        { error: 'Konnte Anfrage nicht speichern.' },
        { status: 500 },
      );
    }

    // 6) Insert addon snapshots (one row per applied addon)
    if (appliedAddons.length > 0) {
      await db.insert(treatmentRequestAddons).values(
        appliedAddons.map((a) => ({
          treatmentRequestId: requestId,
          addonCodeSnapshot: a.addonCode,
          addonLabelSnapshot: a.addonLabel,
          isIncludedSnapshot: Boolean(a.isIncluded),
          priceDeltaSnapshotCents: a.priceDeltaCents ?? 0,
          durationDeltaSnapshotMin: a.durationDeltaMin ?? 0,
        })),
      );
    }

    // 7) Email
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

    const addonsText =
      appliedAddons.length === 0
        ? '(keine Add-ons)'
        : appliedAddons
            .map((a) => {
              const price = a.priceDeltaCents
                ? ` (+${formatEURFromCents(a.priceDeltaCents)})`
                : '';
              const dur = a.durationDeltaMin
                ? ` (+${a.durationDeltaMin} min)`
                : '';
              const includedTag = a.isIncluded ? ' (inklusive)' : '';
              return `- ${a.addonLabel}${includedTag}${price}${dur}`;
            })
            .join('\n');

    const emailArgs: EmailArgs = {
      from,
      to,
      subject: `Terminanfrage am ${day}.${month}.${year} um ${time} Uhr`,
      text:
        `Datum: ${weekday}, ${day}. ${monthName} ${year} um ${time} Uhr\n` +
        `Behandlung: ${offering.treatmentLabel}\n` +
        `Variante: ${offering.variantLabel}\n\n` +
        `Add-ons:\n${addonsText}\n\n` +
        `Gesamtpreis: ${formatEURFromCents(totalPriceCents)}\n` +
        `Gesamtdauer: ${totalDurationMin} min\n\n` +
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
