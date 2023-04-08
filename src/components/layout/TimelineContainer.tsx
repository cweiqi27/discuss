type TimelineContainerProps = {
  children: React.ReactNode;
};

const TimelineContainer = (props: TimelineContainerProps) => {
  return (
    <div className="sm:mx-auto">
      <div className="container mt-24 mb-12 gap-y-2 md:px-4 lg:grid lg:grid-flow-col lg:gap-x-4">
        {props.children}
      </div>
    </div>
  );
};

export default TimelineContainer;
