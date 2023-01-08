import type { FieldValues, UseFormRegister } from "react-hook-form";

type InputProps = {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  addStyles?: string;
};
const inputStyles =
  "rounded border-[0.005rem] border-white bg-zinc-400/40 outline-white";

const Input = (props: InputProps) => {
  return (
    <>
      <label className="text-zinc-200">{props.label}</label>
      <input
        className={`${inputStyles} ${props.addStyles}`}
        type={props.type}
        placeholder={props.placeholder}
        {...props.register(props.name)}
      />
    </>
  );
};

export default Input;
