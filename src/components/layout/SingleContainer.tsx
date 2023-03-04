type SingleContainerProps = {
  children: React.ReactNode;
  addStyles?: string;
};

const SingleContainer = (props: SingleContainerProps) => {
  return (
    <div className="grid h-screen w-screen place-items-center bg-gradient-to-br from-teal-500 via-purple-500 to-pink-500">
      {props.children}
    </div>
  );
};

export default SingleContainer;
