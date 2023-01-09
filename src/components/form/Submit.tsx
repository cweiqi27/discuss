type SubmitProps = {
  value: string;
};

const Submit = (props: SubmitProps) => {
  return (
    <>
      <input
        type="submit"
        value={props.value}
        className="cursor-pointer rounded-full bg-zinc-200 py-2 px-4 transition hover:bg-zinc-300"
      />
    </>
  );
};

export default Submit;
