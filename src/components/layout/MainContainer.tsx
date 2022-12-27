type MainContainerProps = {
  children: React.ReactNode;
};

const MainContainer = (props: MainContainerProps) => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-neutral-800">
      {props.children}
    </main>
  );
};

export default MainContainer;
