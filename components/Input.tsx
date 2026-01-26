'use client';

import { useTranslations } from 'next-intl';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: string;
}

const Input = ({ name, error, ...rest }: InputProps) => {
  const t = useTranslations('form');
  return (
    <div className="w-full">
      <input
        name={name}
        placeholder={t(`fields.${name}`)}
        className="w-full border border-neutral-300 bg-transparent px-4 py-3 rounded-xl"
        {...rest}
      />
      {error && (
        <span
          className="text-xs pl-4 text-red-500">
          {t(error)}
        </span>
      )}
    </div>
  );
};
export default Input;
