type SingleContainerProps = {
  children: React.ReactNode;
  addStyles?: string;
};

const SingleContainer = (props: SingleContainerProps) => {
  return <main className="grid place-items-center">{props.children}</main>;
};

export default SingleContainer;
