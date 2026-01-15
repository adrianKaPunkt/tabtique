interface ButtonProps {
  text: string;
  width?: number;
}

const Button = ({ text, width }: ButtonProps) => {
  return (
    <button
      style={{ width: width }}
      className="text-white bg-black text-sm tracking-[0.15em] px-10 py-3 rounded-sm cursor-pointer hover:bg-gray-700">
      {text}
    </button>
  );
};
export default Button;
