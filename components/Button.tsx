import { cn } from '@/lib/utils';

interface ButtonProps {
  text: string;
  width?: number;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

const Button = ({
  text,
  width,
  type = 'button',
  disabled = false,
  variant,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ width: width }}
      className={cn(
        variant === 'primary' &&
          'text-white bg-black text-sm tracking-[0.15em] px-2 py-3 rounded-sm cursor-pointer hover:bg-gray-700',
        variant === 'secondary' &&
          'text-black bg-white text-sm tracking-[0.15em] px-2 border border-gray-800 py-3 rounded-sm cursor-pointer hover:bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed',
      )}>
      {text}
    </button>
  );
};
export default Button;
