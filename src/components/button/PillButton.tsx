import type { ButtonProps } from "types/component";

const PillButton = (props: ButtonProps) => {
  return (
    <button
      onClick={(event) => props.handleClick(event, 1)}
      className={`btn ${props.type} ${props.size} rounded-full`}
    >
      {props.children}
    </button>
  );
};

export default PillButton;
