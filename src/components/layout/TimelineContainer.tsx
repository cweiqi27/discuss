type TimelineContainerProps = {
  children: React.ReactNode;
};

const TimelineContainer = (props: TimelineContainerProps) => {
  return (
    <div className="sm:mx-auto">
      <div className="container mt-24 mb-12 gap-y-2 sm:grid sm:grid-flow-col sm:gap-x-4 md:px-4">
        {props.children}
      </div>
    </div>
  );
};

export default TimelineContainer;
