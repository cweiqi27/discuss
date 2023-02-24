import { IconSchool } from "@tabler/icons-react";
import Layout from "components/layout/Layout";
import { animate, motion, useAnimation } from "framer-motion";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";

const NewUser: NextPage = (props) => {
  const { isLoading, isSuccess, isError } = trpc.auth.assignRole.useQuery();
  const { data: userName } = trpc.auth.getUserName.useQuery();

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
    const offsetFactor = 15;
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
      <div className="rounded bg-gradient-to-br from-pink-500 to-amber-500">
        <motion.div
          className="rounded border-2 border-purple-500 bg-gradient-to-r from-zinc-200/20 to-zinc-200/30 p-5 shadow-lg shadow-zinc-900"
          animate={objectAnimation}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {isLoading && <div>Loading...</div>}
          {isSuccess && (
            <>
              <IconSchool className="fill-purple-300 text-purple-500" />
              <p>Howdy hey, {userName}</p>
              <p className="cursor-default text-sm text-zinc-800">
                You will be redirected to homepage in {redirectTime} seconds
              </p>
            </>
          )}
          {isError && <>Error</>}
        </motion.div>
      </div>
    </Layout>
  );
};

export default NewUser;
