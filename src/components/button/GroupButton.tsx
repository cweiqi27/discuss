type GroupButtonProps = {
  children: React.ReactNode;
};

const GroupButton = (props: GroupButtonProps) => {
  return <div className="inline-flex">{props.children}</div>;
};

export default GroupButton;
