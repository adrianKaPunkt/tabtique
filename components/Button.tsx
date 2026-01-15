interface ButtonProps {
  text: string;
  width?: number;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({
  text,
  width,
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      style={{ width: width }}
      className="text-white bg-black text-sm tracking-[0.15em] px-10 py-3 rounded-sm cursor-pointer hover:bg-gray-700">
      {text}
    </button>
  );
};
export default Button;
