type MainContainerProps = {
  children: React.ReactNode;
};

const MainContainer = (props: MainContainerProps) => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 overflow-hidden bg-zinc-900">
      {props.children}
    </main>
  );
};

export default MainContainer;
