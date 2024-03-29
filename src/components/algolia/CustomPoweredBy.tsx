import { IconBrandAlgolia } from "@tabler/icons-react";
import Link from "next/link";
import { usePoweredBy } from "react-instantsearch-hooks-web";

const CustomPoweredBy = () => {
  const { url } = usePoweredBy();
  return (
    <div className="inline-flex w-full justify-end gap-1">
      <p className="text-sm text-zinc-400">Search by</p>
      <a
        target="_blank"
        href={url}
        rel="noopener noreferrer"
        className="group inline-flex"
      >
        <IconBrandAlgolia className="text-zinc-400 transition group-hover:text-blue-600" />
        <span className="font-bold text-zinc-400 transition group-hover:text-blue-600">
          Algolia
        </span>
      </a>
    </div>
  );
};

export default CustomPoweredBy;
