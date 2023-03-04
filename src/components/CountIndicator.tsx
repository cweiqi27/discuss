type CountIndicatorProps = {
  count: number;
};

const CountIndicator = ({ count }: CountIndicatorProps) => {
  return (
    <>
      <div className="absolute -top-2 -right-3 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900">
        {count}
      </div>
    </>
  );
};

export default CountIndicator;
