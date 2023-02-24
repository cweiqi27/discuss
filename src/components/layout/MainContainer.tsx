type MainContainerProps = {
  children: React.ReactNode;
};

const MainContainer = (props: MainContainerProps) => {
  return (
    <div className="grid min-h-screen grid-flow-row grid-rows-[auto_1fr_auto] gap-2 overflow-clip bg-zinc-900">
      {props.children}
    </div>
  );
};

export default MainContainer;
