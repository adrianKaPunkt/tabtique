'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Headline from '@/components/Headline';
import Button from '@/components/Button';
import Image from 'next/image';
import Link from 'next/link';

const Contact = () => {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const payload = {
      name: String(form.get('name') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      message: String(form.get('message') || '').trim(),
      email: String(form.get('email') || '').trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json()
        : null;

      if (!res.ok) {
        toast.error(data?.error || 'Senden fehlgeschlagen.');
        setStatus('error');
        return;
      }

      toast.success('Danke! Deine Nachricht wurde gesendet.');
      setStatus('success');
      formEl.reset();
    } catch (err) {
      console.error(err);
      toast.error('Netzwerkfehler. Bitte versuche es erneut.');
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="w-[90%] lg:w-300 mx-auto">
      <Headline title="KONTAKT" />
      <div className="my-15 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="self-center">
          <form
            onSubmit={onSubmit}
            className="space-y-4 flex flex-col items-center gap-2 font-light text-sm">
            <input
              name="name"
              placeholder="Name *"
              required
              className="w-full border border-neutral-300 bg-transparent px-4 py-3 rounded-xl"
            />
            <input
              name="email"
              placeholder="E-mail"
              className="w-full border border-neutral-300 bg-transparent px-4 py-3 rounded-xl"
            />
            <input
              name="phone"
              placeholder="Telefonnummer *"
              required
              className="w-full border border-neutral-300 bg-transparent px-4 py-3 rounded-xl"
            />
            <textarea
              name="message"
              placeholder="Nachricht *"
              required
              rows={6}
              className="w-full border border-neutral-300 bg-transparent px-4 py-3 rounded-xl"
            />
            <Button
              text={status === 'loading' ? 'Sendet...' : 'Senden'}
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
