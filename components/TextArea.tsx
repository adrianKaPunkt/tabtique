'use client';

import { useTranslations } from 'next-intl';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  error?: string;
}

const TextArea = ({ name, error, ...rest }: TextAreaProps) => {
  const t = useTranslations('form');
  return (
    <div className="w-full">
      <textarea
        name={name}
        placeholder={t(`fields.${name}`) + ' *'}
        rows={4}
        className="w-full border border-neutral-300 bg-transparent px-4 py-3 rounded-xl"
        {...rest}
      />
      {error && (
        <span
          className="text-xs"
          style={{ color: '#ff6666', paddingLeft: '16px' }}>
          {t(error)}
        </span>
      )}
    </div>
  );
};
export default TextArea;
