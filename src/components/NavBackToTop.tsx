import { IconArrowBigUpLinesFilled } from "@tabler/icons-react";

const NavBackToTop = () => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="sticky bottom-2 -z-10 flex justify-center">
      <button
        onClick={handleClick}
        className="group inline-flex items-center gap-1 rounded-full bg-zinc-700/80 px-4 py-2 text-center text-lg 
        font-semibold text-zinc-200 transition hover:bg-zinc-600/80"
      >
        <IconArrowBigUpLinesFilled className="group-hover:animate-bounce" />
        <span className="group-hover:animate-pulse">Back to Top</span>
      </button>
    </div>
  );
};

export default NavBackToTop;
