import React, { useEffect, useState } from "react";
import type { Variants } from "framer-motion";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import {
  IconAlertOctagonFilled,
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
} from "@tabler/icons-react";
import type { ToastProps } from "types/component";

const Toast = ({ type, message, timer }: ToastProps) => {
  const [elapsedTime, setElapsedTime] = useState<number>(timer ?? 7);
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    if (elapsedTime === 0) {
      setShow(false);
      return;
    }
    setTimeout(() => {
      setElapsedTime(() => elapsedTime - 1);
    }, 1000);
  }, [elapsedTime]);

  const variants: Variants = {
    enter: { y: 20, opacity: 0 },
    visible: { opacity: 1, y: -10 },
    exit: { opacity: 0, y: 50 },
    hover: { y: -15 },
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {type === "ERROR" && show && (
          <m.div
            key="toast"
            variants={variants}
            initial="enter"
            animate="visible"
            exit="exit"
            whileHover="hover"
            className="fixed bottom-5 left-5 flex cursor-pointer items-center gap-2 rounded-full border border-rose-500 
            bg-zinc-700 px-6 py-4"
            onClick={() => setShow(false)}
          >
            <IconAlertTriangleFilled className="text-rose-500" />
            <span className="text-zinc-300">{message}</span>
          </m.div>
        )}
        {type === "WARNING" && show && (
          <m.div
            key="toast"
            variants={variants}
            initial="enter"
            animate="visible"
            exit="exit"
            whileHover="hover"
            className="fixed bottom-5 left-5 flex cursor-pointer items-center gap-2 rounded-full border border-yellow-500 
            bg-zinc-700 px-6 py-4"
            onClick={() => setShow(false)}
          >
            <IconAlertOctagonFilled className="text-yellow-600" />
            <span className="text-zinc-300">{message}</span>
          </m.div>
        )}
        {type === "SUCCESS" && show && (
          <m.div
            key="toast"
            variants={variants}
            initial="enter"
            animate="visible"
            exit="exit"
            whileHover="hover"
            className="fixed bottom-5 left-5 flex cursor-pointer items-center gap-2 rounded-full border border-green-500 
            bg-zinc-700 px-6 py-4"
            onClick={() => setShow(false)}
          >
            <IconCircleCheckFilled className="text-green-500" />
            <span className="text-zinc-300">{message}</span>
          </m.div>
        )}
        {type === "INFO" && show && (
          <m.div
            key="toast"
            variants={variants}
            initial="enter"
            animate="visible"
            exit="exit"
            whileHover="hover"
            className="fixed bottom-5 left-5 flex cursor-pointer items-center gap-2 rounded-full border border-violet-500 
            bg-zinc-700 px-6 py-4"
            onClick={() => setShow(false)}
          >
            <IconInfoCircleFilled className="text-violet-500" />
            <span className="text-zinc-300">{message}</span>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default Toast;
