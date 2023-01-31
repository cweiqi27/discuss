import Link from "next/link";
import Image from "next/image";

const LogoLink = () => {
  return (
    <Link href="/">
      <Image
        src="/discuss-logos_white.webp"
        alt="logo"
        width={66}
        height={66}
        className="hover:opacity-80"
        priority
      />
    </Link>
  );
};

export default LogoLink;
