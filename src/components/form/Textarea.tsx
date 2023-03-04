import type { FieldValues, UseFormRegister } from "react-hook-form";

type TextareaProps = {
  label?: string;
  name: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  isRequired?: boolean;
  isResize?: boolean;
  addStyles?: string;
  disabled?: boolean;
  value?: string;
};

const textareaStyles = "rounded p-2 bg-zinc-400/40 outline-1 text-zinc-200";

const Textarea = (props: TextareaProps) => {
  return (
    <>
      <label
        className={`${props.disabled ? "text-zinc-500" : "text-zinc-200"}`}
      >
        {props.label}
      </label>
      <textarea
        className={`${textareaStyles} ${props.addStyles} ${
          props.isResize ? "resize-y" : "resize-none"
        }
        ${props.disabled ? "cursor-not-allowed" : "cursor-text"}`}
        placeholder={props.placeholder}
        {...props.register(props.name)}
        disabled={props.disabled}
        defaultValue={props.value}
      />
    </>
  );
};

export default Textarea;
