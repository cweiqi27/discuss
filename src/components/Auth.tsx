import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "utils/trpc";

const Auth = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <button
        className="hidden rounded-full bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20 sm:block"
        onClick={sessionData ? () => signOut() : () => signIn("google")}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
      <div className="fixed bottom-10 left-0 flex w-screen justify-center sm:hidden">
        <button className="rounded-full bg-zinc-700/80 px-4 py-2 text-center text-lg font-semibold text-zinc-200">
          Sign in to comment
        </button>
      </div>
    </>
  );
};

export default Auth;
