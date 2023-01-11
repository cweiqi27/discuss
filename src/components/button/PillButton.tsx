import type { ButtonProps } from "types/component";

const PillButton = (props: ButtonProps) => {
  return (
    <button
      onClick={(event) => props.handleClick(event, 1)}
      className={`btn ${props.colorType} ${props.size} rounded-full`}
      type={props.type}
    >
      {props.children}
    </button>
  );
};

export default PillButton;
