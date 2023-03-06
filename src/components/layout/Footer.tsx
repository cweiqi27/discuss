import { IconBrandGithub } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Footer = () => {
  const { data: sessionData } = useSession();

  const handleClickAuth = () => {
    sessionData ? signOut() : signIn("google");
  };

  return (
    <div className="flex items-end justify-center pb-10">
      <div className="container flex items-end justify-between border-t-[0.05rem] border-zinc-800 px-4 pt-10 sm:items-center sm:px-24">
        <nav className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/"
            className="text-lg font-bold text-zinc-400 transition hover:text-zinc-300"
          >
            Discuss
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-500 transition hover:text-zinc-400"
          >
            Home
          </Link>
          {sessionData && (
            <Link
              href={`/users/${sessionData.user?.id}`}
              className="text-sm text-zinc-500 transition hover:text-zinc-400"
            >
              Profile
            </Link>
          )}
        </nav>
        <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="inline-flex items-end gap-2">
            <span className="cursor-default text-xs text-zinc-500">
              powered by
            </span>
            <a
              href="https://create.t3.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-400 transition hover:text-purple-300"
            >
              create-t3-app
            </a>
          </div>
          <a
            href="https://github.com/cweiqi27/discuss"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition hover:text-zinc-400"
          >
            <IconBrandGithub />
          </a>
          <button
            onClick={handleClickAuth}
            className={`text-sm
          ${
            sessionData
              ? "text-red-400 hover:text-red-500"
              : "text-zinc-400 hover:text-zinc-300"
          }
          
          transition`}
          >
            {sessionData ? "Sign Out" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
