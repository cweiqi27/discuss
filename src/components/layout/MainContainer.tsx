type MainContainerProps = {
  children: React.ReactNode;
};

const MainContainer = (props: MainContainerProps) => {
  return (
    <div className="grid grid-flow-row gap-2 overflow-clip bg-zinc-900">
      {props.children}
    </div>
  );
};

export default MainContainer;
