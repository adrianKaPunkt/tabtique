'use client';

import { useState } from 'react';
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
    setError(null);

    const formEl = e.currentTarget; // ✅ Referenz sichern

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

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setError(data?.error || 'Senden fehlgeschlagen');
        return;
      }

      setStatus('success');
      setError(null);
      formEl.reset(); // ✅ funktioniert zuverlässig
    } catch (err) {
      console.error('Submit error:', err);
      setStatus('error');
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
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
            placeholder="Email"
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

          {status === 'success' && (
            <p className="text-sm text-green-400">
              Danke! Deine Nachricht wurde gesendet.
            </p>
          )}

          {status === 'error' && (
            <p className="text-sm text-red-400">{error}</p>
          )}
        </form>
      </div>
    </section>
  );
};
export default Contact;
