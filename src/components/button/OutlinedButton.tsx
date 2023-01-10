import type { ButtonProps } from "types/component";

const OutlinedButton = (props: ButtonProps) => {
  return (
    <button
      onClick={(event) => props.handleClick(event, 1)}
      className={`btn ${props.type} ${props.size} btn-outline rounded-lg`}
    >
      {props.children}
    </button>
  );
};

export default OutlinedButton;
