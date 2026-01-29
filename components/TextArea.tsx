'use client';

import { useTranslations } from 'next-intl';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name?: string;
  label?: string;
  error?: string;
}

const TextArea = ({ name, label, error, ...rest }: TextAreaProps) => {
  const t = useTranslations('form');
  return (
    <div className="w-full relative">
      {label && (
        <div className="text-[10px] absolute -top-2 left-3 bg-white text-gray-400 px-1">
          {label}
        </div>
      )}
      <textarea
        name={name}
        placeholder={name && t(`fields.${name}`)}
        rows={4}
        className="w-full border border-neutral-300 bg-transparent px-4 py-3 rounded-xl"
        {...rest}
      />
      {error && <span className="text-xs pl-4 text-red-500">{t(error)}</span>}
    </div>
  );
};
export default TextArea;
