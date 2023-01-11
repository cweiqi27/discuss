import type { FieldValues, UseFormRegister } from "react-hook-form";

type InputProps = {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  addStyles?: string;
  click?: () => void;
};
const inputStyles = "rounded p-2 bg-zinc-400/40 text-zinc-200";

const Input = (props: InputProps) => {
  return (
    <>
      <label className="text-zinc-200">{props.label}</label>
      <input
        className={`${inputStyles} ${props.addStyles}`}
        type={props.type}
        placeholder={props.placeholder}
        {...props.register(props.name)}
        onClick={props.click}
      />
    </>
  );
};

export default Input;
