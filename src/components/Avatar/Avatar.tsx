import Image from "next/image";
import { trpc } from "utils/trpc";

type AvatarProps = {
  src: string;
  alt: string;
  addStyles?: string;
};

const Avatar = (props: AvatarProps) => {
  const { data: blurredImage } = trpc.image.blurImage.useQuery({
    src: props.src,
  });
  return props.src === "" ? (
    <div
      className={`h-12 w-12 animate-pulse rounded-full bg-gray-400 ${props.addStyles}`}
    />
  ) : (
    <Image
      src={props.src}
      alt={props.alt}
      width="48"
      height="48"
      className={`rounded-full ${props.addStyles}`}
    />
  );
};

export default Avatar;
