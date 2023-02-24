type ProfileContainerProps = {
  children: React.ReactNode;
  addStyles?: string;
};

const ProfileContainer = (props: ProfileContainerProps) => {
  return (
    <div className="mx-auto">
      <main className="container mt-24 grid grid-flow-col gap-x-4 md:px-4">
        {props.children}
      </main>
    </div>
  );
};

export default ProfileContainer;
