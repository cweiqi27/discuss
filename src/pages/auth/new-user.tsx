import { IconSchool } from "@tabler/icons-react";
import UserAvatar from "components/avatar/UserAvatar";
import Layout from "components/layout/Layout";
import Spinner from "components/Spinner";
import { animate, motion, useAnimation } from "framer-motion";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";

const NewUser: NextPage = (props) => {
  const { isLoading, isSuccess, isError } = trpc.auth.assignRole.useQuery();
  const { data: userName } = trpc.auth.getUserName.useQuery();
  const { data: userId } = trpc.auth.getUserId.useQuery();

  const router = useRouter();
  const timer = 60;
  const [redirectTime, setRedirectTime] = useState<number>(timer);

  /**
   * Redirect to homepage after successfully mutate
   */
  useEffect(() => {
    if (isSuccess) {
      if (redirectTime === 0) {
        router.push("/");
        return;
      }

      setTimeout(() => {
        console.log(redirectTime);
        setRedirectTime(() => redirectTime - 1);
      }, 1000);
    }
  }, [isSuccess, router, redirectTime]);

  /**
   * Move object based on mouse position
   */
  const objectAnimation = useAnimation();

  const handleMouseMove = (e: React.MouseEvent) => {
    const moveX = e.clientX - window.innerWidth / 2;
    const moveY = e.clientY - window.innerHeight / 2;
    const offsetFactor = 10;
    objectAnimation.start({
      x: moveX / offsetFactor,
      y: moveY / offsetFactor,
    });
  };

  const handleMouseLeave = () => {
    objectAnimation.start({
      x: 0,
      y: 0,
    });
  };

  return (
    <Layout type="SINGLE">
      <section className="rounded-l ">
        <motion.div
          className="flex flex-col items-center gap-2 rounded border-[0.25px] border-white bg-gradient-to-r from-zinc-50/10 to-zinc-50/20 p-5 shadow-lg"
          animate={objectAnimation}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {isLoading && <Spinner />}
          {isSuccess && (
            <>
              <IconSchool className="animate-bounce fill-pink-300 text-purple-500" />
              <UserAvatar size="lg" />
              <div className="flex cursor-default flex-col items-center gap-1">
                <h1 className="text-2xl font-semibold text-zinc-700">
                  Welcome aboard,
                </h1>
                <span
                  className="bg-gradient-to-br from-teal-600 via-purple-600 to-pink-600 bg-clip-text align-bottom text-3xl font-bold
              uppercase text-transparent"
                >
                  {userName}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <h2 className="cursor-default font-semibold text-zinc-700">
                  What&apos;s next?
                </h2>
                <Link
                  href={`/users/${userId}`}
                  className="rounded-full bg-zinc-50/10 from-teal-500 via-purple-500 to-pink-500
                px-3 py-1 text-zinc-700 transition hover:bg-gradient-to-r
                hover:font-semibold hover:text-zinc-300"
                >
                  Fill up your bio
                </Link>
                <Link
                  href="/"
                  className="rounded-full bg-zinc-50/10 from-teal-500 via-purple-500 to-pink-500
                px-3 py-1 text-zinc-700 transition hover:bg-gradient-to-r
                hover:font-semibold hover:text-zinc-300"
                >
                  Explore Discuss&trade;
                </Link>
              </div>
              <p className="cursor-default text-xs text-zinc-600">
                Redirecting to homepage in {redirectTime} seconds
              </p>
            </>
          )}
          {isError && <>Error</>}
        </motion.div>
      </section>
    </Layout>
  );
};

export default NewUser;
