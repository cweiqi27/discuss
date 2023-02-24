type SingleContainerProps = {
  children: React.ReactNode;
  addStyles?: string;
};

const SingleContainer = (props: SingleContainerProps) => {
  return <div className="grid place-items-center">{props.children}</div>;
};

export default SingleContainer;
