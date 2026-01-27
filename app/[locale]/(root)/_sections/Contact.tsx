'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import Headline from '@/components/Headline';
import Button from '@/components/Button';
import Image from 'next/image';
import Link from 'next/link';
import useTreatmentStore from '@/store/treatment-store';
import TreatmentPicker from '@/components/TreatmentPicker';
import {
  ContactFormValues,
  ContactSchema,
  validateContactField,
} from '@/lib/validation/contact';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import DateInput from '@/components/DateInput';
import TimeSlots from '@/components/TimeSlots';
import type { TreatmentOfferingDTO } from '@/lib/server/getTreatmentOfferings';

type ContactProps = {
  offerings: TreatmentOfferingDTO[];
};

const Contact = ({ offerings }: ContactProps) => {
  const t = useTranslations('contact');
  const todayISO = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle');
  type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const treatment = useTreatmentStore((state) => state.treatment);
  const clearTreatment = useTreatmentStore((s) => s.clearTreatment);
  const treatmentVariant = useTreatmentStore((s) => s.treatmentVariant);

  /**
   * 'Clear treatment field error
   */
  // const clearTreatmentError = () => {
  //   setFieldErrors((prev) => {
  //     if (!prev.treatment) return prev;
  //     const { treatment, ...rest } = prev;
  //     return rest;
  //   });
  // };
  const clearTreatmentErrors = () => {
    setFieldErrors((prev) => {
      const { treatment, treatmentVariant, ...rest } = prev;
      return rest;
    });
  };
  /**
   * 'Validate single field
   * @param field
   * @param raw
   */
  const validateField = (field: keyof ContactFormValues, raw: string) => {
    const value = raw.trim();
    const msg = validateContactField(field, value);

    setFieldErrors((prev) => {
      if (!msg) {
        if (!prev[field]) return prev;
        const { [field]: _reomoved, ...rest } = prev;
        return rest;
      }
      return { ...prev, [field]: msg };
    });
  };

  /**
   * 'Field blur event handler
   * @param field
   * @returns
   */
  const onBlurField =
    (field: keyof ContactFormValues) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      validateField(field, e.target.value);
    };

  /**
   * 'Field change event handler
   * @param field
   * @returns
   */
  const onChangeField =
    (field: keyof ContactFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!fieldErrors[field]) return;
      validateField(field, e.target.value);
    };

  /**
   * 'Form submit handler -------------------------------------------
   * @param e {React.FormEvent<HTMLFormElement>}
   * @returns {Promise<void>}
   */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    console.log('1) start');

    setFieldErrors({});

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const payload = {
      name: String(form.get('name') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      message: String(form.get('message') || '').trim(),
      email: String(form.get('email') || '').trim(),
      treatment: treatment,
      treatmentVariant: treatmentVariant,
      date: date,
      time: time,
    };
    const result = ContactSchema.safeParse(payload);

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !errors[key]) errors[key] = issue.message; // erste Message pro Feld
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

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json()
        : null;

      if (!res.ok) {
        toast.error(data?.error || t('error'));
        setStatus('error');
        return;
      }

      toast.success(t('success'));
      setStatus('success');
      formEl.reset();
      clearTreatment();
      setDate('');
      setTime('');
      setFieldErrors({});
    } catch (err) {
      toast.error(t('error'));
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="w-[90%] xl:w-300 mx-auto scroll-mt-32">
      <Headline title={t('title')} />
      <p className="p-5 leading-7 mt-7 font-light md:text-center">
        {t('description')}
      </p>

      <TreatmentPicker
        offerings={offerings}
        onSelect={clearTreatmentErrors}
        errorTreatment={fieldErrors.treatment}
        errorTreatmentVariant={fieldErrors.treatmentVariant}
      />

      <div className="mb-15 mt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="self-center">
          <form
            onSubmit={onSubmit}
            className="space-y-4 flex flex-col items-center gap-2 font-light text-sm">
            <div className="w-full flex gap-6">
              <DateInput
                name="date"
                error={fieldErrors.date}
                value={date}
                min={todayISO}
                onChange={(e) => {
                  setDate(e.currentTarget.value);

                  // optional: wenn schon ein Fehler da war, live entfernen
                  if (fieldErrors.date) {
                    setFieldErrors((prev) => {
                      const { date: _removed, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                onBlur={() => {
                  // onBlur validieren (wie bei anderen Feldern)
                  const result = ContactSchema.shape.date.safeParse(date);
                  setFieldErrors((prev) => {
                    if (result.success) {
                      const { date: _removed, ...rest } = prev;
                      return rest;
                    }
                    return { ...prev, date: result.error.issues[0]?.message };
                  });
                }}
              />
              <TimeSlots
                value={time}
                onChange={(v) => {
                  setTime(v);
                  // optional: Fehler sofort entfernen
                  if (fieldErrors.time) {
                    setFieldErrors((prev) => {
                      const { time: _removed, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                error={fieldErrors.time}
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
              text={status === 'loading' ? t('submit') + '...' : t('submit')}
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
