import Image from "next/image";
import { trpc } from "utils/trpc";

type AvatarProps = {
  src: string;
  alt: string;
};

const Avatar = (props: AvatarProps) => {
  const { data: blurredImage } = trpc.image.blurImage.useQuery({
    src: props.src,
  });
  return props.src === "" ? (
    <div className="h-12 w-12 flex-none animate-pulse rounded-full bg-gray-400" />
  ) : (
    <Image
      src={props.src}
      alt={props.alt}
      width="48"
      height="48"
      className="rounded-full"
    />
  );
};

export default Avatar;
