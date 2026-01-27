'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

import Headline from '@/components/Headline';
import Button from '@/components/Button';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import DateInput from '@/components/DateInput';
import TimePicker from '@/components/TimePicker';
import TreatmentPicker from '@/components/TreatmentPicker';

import useTreatmentStore from '@/store/treatment-store';
import {
  ContactFormValues,
  ContactSchema,
  validateContactField,
} from '@/lib/validation/contact';

import type { TreatmentOfferingDTO } from '@/lib/server/getTreatmentOfferingsWithAddons';
import { TIME_SLOTS } from '@/lib/constants/timeSlots';

type ContactProps = {
  offerings: TreatmentOfferingDTO[];
};

const Contact = ({ offerings }: ContactProps) => {
  const t = useTranslations('contact');

  const todayISO = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle');

  type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const treatmentOfferingId = useTreatmentStore((s) => s.treatmentOfferingId);
  const clearTreatmentOfferingId = useTreatmentStore(
    (s) => s.clearTreatmentOfferingId,
  );
  const selectedAddonCodes = useTreatmentStore((s) => s.selectedAddonCodes);

  // 'Helpers
  const validateField = (field: keyof ContactFormValues, raw: string) => {
    const value = raw.trim();
    const msg = validateContactField(field, value);

    setFieldErrors((prev) => {
      if (!msg) {
        if (!prev[field]) return prev;
        const { [field]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [field]: msg };
    });
  };

  const onBlurField =
    (field: keyof ContactFormValues) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      validateField(field, e.target.value);
    };

  const onChangeField =
    (field: keyof ContactFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!fieldErrors[field]) return;
      validateField(field, e.target.value);
    };

  /**
   * 'Submit contact form
   * @param e {FormEvent} - form event
   * @returns
   */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setFieldErrors({});

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const payload: ContactFormValues = {
      name: String(form.get('name') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      email: String(form.get('email') || '').trim(),
      message: String(form.get('message') || '').trim(),
      date: date,
      time: time as (typeof TIME_SLOTS)[number],
      treatmentOfferingId: treatmentOfferingId ?? '',
      selectedAddonCodes: selectedAddonCodes,
    };

    const result = ContactSchema.safeParse(payload);

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !errors[key]) errors[key] = issue.message;
      }

      setFieldErrors(errors);
      setStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || t('error'));
        setStatus('error');
        return;
      }

      toast.success(t('success'));
      setStatus('success');

      formEl.reset();
      clearTreatmentOfferingId();
      setDate('');
      setTime('');
      setFieldErrors({});
    } catch {
      toast.error(t('error'));
      setStatus('error');
    }
  }

  // 'Render
  return (
    <section id="contact" className="w-[90%] xl:w-300 mx-auto scroll-mt-32">
      <Headline title={t('title')} />
      <p className="p-5 leading-7 mt-7 font-light md:text-center">
        {t('description')}
      </p>

      <TreatmentPicker
        offerings={offerings}
        onSelect={() =>
          setFieldErrors((prev) => {
            const { treatmentOfferingId, ...rest } = prev;
            return rest;
          })
        }
        errorTreatment={fieldErrors.treatmentOfferingId}
      />

      <div className="mb-15 mt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="self-center">
          <form
            onSubmit={onSubmit}
            className="space-y-4 flex flex-col items-center gap-2 font-light text-sm">
            <div className="w-full flex gap-6">
              <DateInput
                name="date"
                value={date}
                min={todayISO}
                error={fieldErrors.date}
                onChange={(e) => setDate(e.currentTarget.value)}
                onBlur={() => validateField('date', date)}
              />
              <TimePicker
                name="time"
                value={time}
                error={fieldErrors.time}
                onChange={(v) => setTime(v)}
              />
            </div>

            <Input
              name="name"
              error={fieldErrors.name}
              onBlur={onBlurField('name')}
              onChange={onChangeField('name')}
            />
            <Input
              name="email"
              error={fieldErrors.email}
              onBlur={onBlurField('email')}
              onChange={onChangeField('email')}
            />
            <Input
              name="phone"
              error={fieldErrors.phone}
              onBlur={onBlurField('phone')}
              onChange={onChangeField('phone')}
            />
            <TextArea
              name="message"
              error={fieldErrors.message}
              onBlur={onBlurField('message')}
              onChange={onChangeField('message')}
            />

            <Button
              text={status === 'loading' ? `${t('submit')}…` : t('submit')}
              width={300}
              type="submit"
              disabled={status === 'loading'}
            />
          </form>
        </div>

        <div>
          <Link
            href="https://www.google.com/maps/search/?api=1&query=Hochstraße+43,+60313+Frankfurt+am+Main"
            target="_blank"
            rel="noopener noreferrer">
            <Image
              src="/map.jpg"
              alt="location-map"
              width={500}
              height={500}
              className="w-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Contact;
