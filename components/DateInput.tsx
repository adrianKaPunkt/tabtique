'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  error?: string;
};

export default function DateInput({ name, error, className, ...rest }: Props) {
  const t = useTranslations('form');

  return (
    <div className="w-full">
      <input
        type="date"
        name={name}
        aria-invalid={!!error}
        className={[
          'w-full border bg-transparent px-4 py-3 rounded-xl',
          error ? 'border-red-500' : 'border-neutral-300',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {error && (
        <p
          className="mt-1 text-xs"
          style={{ color: '#ff6666', paddingLeft: '16px' }}>
          {t(error)}
        </p>
      )}
    </div>
  );
}
