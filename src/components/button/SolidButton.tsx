import type { ButtonProps } from "types/component";

const SolidButton = (props: ButtonProps) => {
  return (
    <button
      onClick={(event) => props.handleClick(event, 1)}
      className={`btn ${props.type} ${props.size} rounded-lg`}
    >
      {props.children}
    </button>
  );
};

export default SolidButton;
