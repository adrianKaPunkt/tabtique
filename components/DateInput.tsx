'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name?: string;
  label?: string;
  error?: string;
  containerClassName?: string;
};

export default function DateInput({
  name,
  label,
  error,
  className,
  containerClassName,
  value,
  ...rest
}: Props) {
  const t = useTranslations('form');

  const hasValue = typeof value === 'string' && value.length > 0;

  return (
    <div className="w-full">
      <div className={cn('relative w-full', containerClassName)}>
        {!hasValue && name ? (
          <span
            className={cn(
              'pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-400 text-sm',
            )}>
            {t('fields.date')}
          </span>
        ) : (
          <div className="text-[10px] absolute -top-2 left-3 bg-white text-gray-400 px-1">
            {label}
          </div>
        )}

        <input
          type="date"
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={cn(
            'w-full border bg-transparent px-4 py-3 rounded-xl',
            !hasValue && 'text-transparent border-neutral-300',
            className,
          )}
          value={value}
          {...rest}
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs pl-4 text-red-400">
          {t(error)}
        </p>
      )}
    </div>
  );
}
