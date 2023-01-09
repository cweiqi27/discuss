import { FieldValues, UseFormRegister } from "react-hook-form";

type TextareaProps = {
  label: string;
  name: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  isRequired?: boolean;
  isResize?: boolean;
  addStyles?: string;
};

const textareaStyles = "rounded p-2 bg-zinc-400/40 outline-1 text-zinc-200";

const Textarea = (props: TextareaProps) => {
  return (
    <>
      <label className="text-zinc-200">{props.label}</label>
      <textarea
        className={`${textareaStyles} ${props.addStyles} ${
          props.isResize ? "resize-y" : "resize-none"
        }`}
        placeholder={props.placeholder}
        {...props.register(props.name)}
      />
    </>
  );
};

export default Textarea;
