'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Headline from '@/components/Headline';
import Button from '@/components/Button';

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
    <section id="contact" className="w-[90%] mx-auto">
      <Headline title="KONTAKT" />
      <div className="my-15 text-center">
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name *"
            required
            className="w-110 border border-neutral-300 bg-transparent px-4 py-3 text-sm rounded-xl"
          />
          <input
            name="email"
            placeholder="E-mail"
            className="w-110 border border-neutral-300 bg-transparent px-4 py-3 text-sm rounded-xl"
          />
          <input
            name="phone"
            placeholder="Telefonnummer *"
            required
            className="w-110 border border-neutral-300 bg-transparent px-4 py-3 text-sm rounded-xl"
          />
          <textarea
            name="message"
            placeholder="Nachricht *"
            required
            rows={6}
            className="w-110 border border-neutral-300 bg-transparent px-4 py-3 text-sm rounded-xl"
          />
          <Button
            text={status === 'loading' ? 'Sendet...' : 'Senden'}
            width={300}
            type="submit"
            disabled={status === 'loading'}
          />
        </form>
      </div>
    </section>
  );
};
export default Contact;
