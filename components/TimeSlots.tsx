'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { TIME_SLOTS, type TimeSlot } from '@/lib/constants/timeSlots';

type Props = {
  value: string;
  onChange: (value: TimeSlot | '') => void;
  error?: string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
};

export default function TimeSlots({
  value,
  onChange,
  error,
  className,
  containerClassName,
  disabled,
}: Props) {
  const f = useTranslations('form');

  return (
    <div className={cn('w-full', containerClassName)}>
      <select
        name="time"
        value={value}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? 'error' : undefined}
        onChange={(e) => onChange(e.currentTarget.value as TimeSlot | '')}
        className={cn(
          'w-full border bg-transparent px-4 py-3 rounded-xl border-neutral-300',
          value === '' ? 'text-neutral-400' : 'text-neutral-900',
          disabled && 'opacity-60 cursor-not-allowed',
          className,
        )}>
        {/* "Placeholder" */}
        <option value="" disabled>
          {f('fields.time')}
        </option>

        {TIME_SLOTS.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      {error && (
        <p id="time-error" className="mt-1 text-xs pl-4 text-red-400">
          {f(error)}
        </p>
      )}
    </div>
  );
}
