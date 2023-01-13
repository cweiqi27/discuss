type StickyCardProps = {
  text: string;
  color: "teal" | "rose" | "purple";
};

function StickyCard(props: StickyCardProps) {
  return props.color === "teal" ? (
    <div className="flex flex-col rounded bg-gradient-to-br from-teal-500 to-rose-400 p-4">
      <h3 className="text-color-white text-xl font-bold">{props.text}</h3>
    </div>
  ) : props.color === "rose" ? (
    <div className="flex flex-col rounded bg-gradient-to-br from-rose-500 to-fuchsia-500 p-4">
      <h3 className="text-color-white text-xl font-bold">{props.text}</h3>
    </div>
  ) : props.color === "purple" ? (
    <div className="flex flex-col rounded bg-gradient-to-br from-purple-500 to-amber-500 p-4">
      <h3 className="text-color-white text-xl font-bold">{props.text}</h3>
    </div>
  ) : null;
}

export default StickyCard;
