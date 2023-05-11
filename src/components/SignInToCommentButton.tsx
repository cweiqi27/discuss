import { signIn, useSession } from "next-auth/react";

const SignInToCommentButton = () => {
  const { status } = useSession();
  return status === "loading" ? (
    <div className="fixed bottom-10 left-0 flex w-screen justify-center sm:hidden">
      <button
        className="animate-pulse rounded-full bg-zinc-700/80 px-4 py-2 text-center text-lg font-semibold text-zinc-200 backdrop-blur"
        disabled
      >
        Discuss
      </button>
    </div>
  ) : status === "unauthenticated" ? (
    <div className="fixed bottom-10 left-0 flex w-screen justify-center sm:hidden">
      <button
        className="rounded-full bg-zinc-700/80 px-4 py-2 text-center text-lg font-semibold text-zinc-200 backdrop-blur"
        onClick={() => signIn("google")}
      >
        Sign in to comment
      </button>
    </div>
  ) : null;
};

export default SignInToCommentButton;
