interface HeadlineProps {
  title: string;
}

const Headline = ({ title }: HeadlineProps) => {
  return (
    <div className="relative text-center">
      <div className="absolute top-4 border-b border w-full -z-10"></div>
      <div className="flex justify-center">
        <h2 className="font-cinzel text-4xl bg-white w-fit px-5">{title}</h2>
      </div>
    </div>
  );
};
export default Headline;
