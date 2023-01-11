import type { ButtonProps } from "types/component";

const SolidButton = (props: ButtonProps) => {
  return (
    <button
      onClick={(event) => props.handleClick(event, 1)}
      className={`btn ${props.colorType} ${props.size} rounded-lg`}
      type={props.type}
    >
      {props.children}
    </button>
  );
};

export default SolidButton;
