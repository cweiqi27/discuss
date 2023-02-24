import type { ButtonProps } from "types/component";

const SolidButton = (props: ButtonProps) => {
  return (
    <button
      onClick={(event) => props.handleClick(event, 1)}
      className={`btn ${props.colorType} ${props.size} ${
        props.rounded ? "rounded-lg" : ""
      } ${props.active ? "btn-active" : ""} ${props.addStyles}`}
      type={props.type}
    >
      {props.children}
    </button>
  );
};

export default SolidButton;
