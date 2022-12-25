type ContainerProps = {
  children: React.ReactNode;
  addStyles?: string;
};

const Container = (props: ContainerProps) => {
  return <div className="container mx-auto md:px-4">{props.children}</div>;
};

export default Container;
