import Image from "next/image";
import Link from "next/link";
import type { HitProps } from "types/algolia";

const HitManageUser = ({ hit }: HitProps) => {
  return hit.name ? (
    <>
      {/* User */}
      <Link
        href={`/manage-users/${hit.objectID}`}
        className="group mb-2 flex items-center gap-4 rounded bg-zinc-700 p-3 transition hover:bg-zinc-900"
      >
        {hit.image && (
          <Image
            src={hit.image}
            alt={hit.name ?? ""}
            width={48}
            height={48}
            className="rounded-lg group-hover:opacity-80"
          />
        )}
        <p className="truncate text-lg font-semibold text-zinc-400">
          {hit.name}
        </p>
      </Link>
    </>
  ) : hit.title ? (
    <></>
  ) : hit.flairName ? (
    <></>
  ) : (
    <></>
  );
};

export default HitManageUser;
