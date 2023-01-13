import Image from "next/image";
import Link from "next/link";

type AvatarProps = {
  src: string;
  alt: string;
  addStyles?: string;
  profileLink: string;
};

const Avatar = (props: AvatarProps) => {
  return props.src === "" ? (
    <div
      className={`h-12 w-12 animate-pulse rounded-full bg-gray-400 ${props.addStyles}`}
    />
  ) : (
    <Link href={props.profileLink}>
      <Image
        src={props.src}
        alt={props.alt}
        width="48"
        height="48"
        className={`rounded-full hover:opacity-80 ${props.addStyles}`}
      />
    </Link>
  );
};

export default Avatar;
