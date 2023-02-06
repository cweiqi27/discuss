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
      <button className="">Sign in to comment.</button>
    </>
  );
};

export default Auth;
