type MainContainerProps = {
  children: React.ReactNode;
};

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <div className="grid min-h-screen grid-flow-row grid-rows-[auto_1fr_auto] overflow-clip bg-zinc-900">
      {children}
    </div>
  );
};

export default MainContainer;
