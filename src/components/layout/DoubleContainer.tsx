type DoubleContainerProps = {
  children: React.ReactNode;
  addStyles?: string;
};

const DoubleContainer = (props: DoubleContainerProps) => {
  return (
    <div className="my-4 sm:mx-auto">
      <main className="mt-24 grid grid-flow-col gap-x-4 md:px-4">
        {props.children}
      </main>
    </div>
  );
};

export default DoubleContainer;
