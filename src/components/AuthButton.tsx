import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "utils/trpc";

const AuthButton = () => {
  const { data: sessionData, status } = useSession();

  const handleClick = () => {
    sessionData ? signOut() : signIn("google");
  };

  return (
    <>
      {status === "unauthenticated" && (
        <button
          className="hidden rounded-full bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20 sm:block"
          onClick={handleClick}
        >
          Sign in
        </button>
      )}
      {status === "unauthenticated" && (
        <div className="fixed bottom-10 left-0 flex w-screen justify-center sm:hidden">
          <button className="rounded-full bg-zinc-700/80 px-4 py-2 text-center text-lg font-semibold text-zinc-200">
            Sign in to comment
          </button>
        </div>
      )}
      {status === "loading" && (
        <div className="h-12 w-12 animate-pulse rounded-full bg-gray-400" />
      )}
      {status === "authenticated" && (
        <button
          className="hidden rounded-full bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20 sm:block"
          onClick={handleClick}
        >
          Sign Out
        </button>
      )}
    </>
  );
};

export default AuthButton;
