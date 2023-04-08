import Image from "next/image";
import Link from "next/link";

type AvatarProps = {
  src: string;
  name: string;
  size: "sm" | "md" | "lg";
  addStyles?: string;
  profileSlug?: string;
};

const Avatar = ({ src, name, size, addStyles, profileSlug }: AvatarProps) => {
  let widthHeight = 0;
  let twWidth = "",
    twHeight = "";
  if (size === "sm") {
    widthHeight = 36;
    twWidth = "h-9";
    twHeight = "h-9";
  } else if (size === "md") {
    widthHeight = 48;
    twWidth = "h-12";
    twHeight = "h-12";
  } else if (size === "lg") {
    widthHeight = 64;
    twWidth = "h-[64px]";
    twHeight = "h-[64px]";
  }

  return src === "" ? (
    <div
      className={`${twHeight} ${twWidth} animate-pulse rounded-full bg-gray-400 ${addStyles}`}
    />
  ) : profileSlug ? (
    <Link href={`/users/${profileSlug}`}>
      <Image
        src={src}
        alt={`${name}'s avatar`}
        width={widthHeight}
        height={widthHeight}
        className={`rounded-full hover:opacity-80 ${addStyles}`}
      />
    </Link>
  ) : (
    <Image
      src={src}
      alt={`${name}'s avatar`}
      width={widthHeight}
      height={widthHeight}
      className={`rounded-full hover:opacity-80 ${addStyles}`}
    />
  );
};

export default Avatar;
