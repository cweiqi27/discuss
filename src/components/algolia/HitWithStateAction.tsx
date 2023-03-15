import {
  IconMessages,
  IconSpeakerphone,
  IconSticker,
  IconTag,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Highlight } from "react-instantsearch-hooks-web";
import { useUserInputStore } from "store/inputStore";
import type { HitProps } from "types/algolia";

const HitWithStateAction = ({ hit }: HitProps) => {
  const setInput = useUserInputStore((state) => state.setInput);

  const formattedDate = useMemo(() => {
    if (hit.createdAt)
      return formatDistanceToNow(new Date(hit.createdAt)) + " ago";
  }, [hit.createdAt]);

  return hit.name ? (
    <>
      {/* User */}
      <button
        className="group mb-2 flex w-full items-center gap-4 rounded bg-zinc-700 p-3 transition hover:bg-zinc-900"
        onClick={() => setInput(hit.objectID)}
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
        <div>
          <h1 className="text-lg font-semibold text-zinc-400">
            {/* {
              <Highlight
                classNames={{
                  root: "text-zinc-300",
                  highlighted:
                    "bg-pink-500 font-semibold text-zinc-300 rounded italic",
                }}
                hit={hit}
                attribute="name"
              />
            } */}
            {hit.name}
          </h1>
        </div>
      </button>
    </>
  ) : hit.title ? (
    <>
      {/* Post */}
      <button
        onClick={() => setInput(hit.objectID)}
        className="mb-2 flex items-center gap-4 rounded bg-zinc-700 p-3 transition hover:bg-zinc-900"
      >
        {hit.category === "discussion" ? (
          <IconMessages className="h-[48px] w-[48px] text-zinc-400" />
        ) : hit.category === "sticky" ? (
          <IconSticker className="h-[48px] w-[48px] text-zinc-400" />
        ) : hit.category === "announcement" ? (
          <IconSpeakerphone className="h-[48px] w-[48px] text-zinc-400" />
        ) : (
          <></>
        )}
        <div className="flex w-full flex-col gap-2 overflow-hidden">
          <div className="flex gap-1">
            <span className="rounded-full bg-zinc-600 px-2 py-1 text-xs text-zinc-400">
              {hit.type}
            </span>
            <span className="rounded-full bg-zinc-600 px-2 py-1 text-xs capitalize text-zinc-400">
              {hit.category}
            </span>
          </div>
          <span className="text-sm text-zinc-400">{formattedDate}</span>
          <p className="truncate text-lg font-semibold text-zinc-400">
            {/* <Highlight
              classNames={{
                root: "text-zinc-400",
                highlighted:
                  "bg-pink-500 font-semibold text-zinc-300 rounded italic",
              }}
              hit={hit}
              attribute="title"
            /> */}
            {hit.title}
          </p>
          <p className="truncate text-xs text-zinc-500">{hit.description}</p>
        </div>
      </button>
    </>
  ) : hit.flairName ? (
    <>
      {/* Flair */}
      <button
        onClick={() => setInput(hit.objectID)}
        className="mb-2 flex items-center gap-4 rounded bg-zinc-700 p-3 transition hover:bg-zinc-900"
      >
        <IconTag className="h-[48px] w-[48px] text-zinc-400" />
        <div className="flex flex-col gap-1">
          <span className="self-start rounded-full bg-zinc-600 px-2 py-1 text-xs text-zinc-400">
            {hit.type}
          </span>
          {/* <Highlight
            classNames={{
              root: "text-zinc-400",
              highlighted:
                "bg-pink-500 font-semibold text-zinc-300 rounded italic",
            }}
            hit={hit}
            attribute="flairName"
          /> */}
          {hit.flairName}
        </div>
      </button>
    </>
  ) : (
    <></>
  );
};

export default HitWithStateAction;
