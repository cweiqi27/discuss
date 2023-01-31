import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DependencyList, MutableRefObject } from "react";

/**
 * Get scroll position on throttle (every changes)
 */
export const useScrollPositionThrottle = (): number => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  function handleScroll() {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const scrolled = (winScroll / height) * 100;

    setScrollPosition(scrolled);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  return scrollPosition;
};

/*
 * Optimized debounce scroll position (https://github.com/n8tb1t/use-scroll-position)
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface IPosition {
  x: number;
  y: number;
}

interface IScrollProps {
  prevPos: IPosition;
  currPos: IPosition;
}

type ElementRef = MutableRefObject<HTMLElement | undefined>;

const isBrowser = typeof window !== `undefined`;
const zeroPosition = { x: 0, y: 0 };

const getClientRect = (element?: HTMLElement) =>
  element?.getBoundingClientRect();

const getScrollPosition = ({
  element,
  useWindow,
  boundingElement,
}: {
  element?: ElementRef;
  boundingElement?: ElementRef;
  useWindow?: boolean;
}) => {
  if (!isBrowser) {
    return zeroPosition;
  }

  if (useWindow) {
    return { x: window.scrollX, y: window.scrollY };
  }

  const targetPosition = getClientRect(element?.current || document.body);
  const containerPosition = getClientRect(boundingElement?.current);

  if (!targetPosition) {
    return zeroPosition;
  }

  return containerPosition
    ? {
        x: (containerPosition.x || 0) - (targetPosition.x || 0),
        y: (containerPosition.y || 0) - (targetPosition.y || 0),
      }
    : { x: targetPosition.left, y: targetPosition.top };
};

export const useScrollPositionDebounce = (
  effect: (props: IScrollProps) => void,
  deps?: DependencyList,
  element?: ElementRef,
  useWindow?: boolean,
  wait?: number,
  boundingElement?: ElementRef
): void => {
  const position = useRef(getScrollPosition({ useWindow, boundingElement }));

  let throttleTimeout: number | null = null;

  const callBack = () => {
    const currPos = getScrollPosition({ element, useWindow, boundingElement });
    effect({ prevPos: position.current, currPos });
    position.current = currPos;
    throttleTimeout = null;
  };

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) {
      return undefined;
    }

    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = window.setTimeout(callBack, wait);
        }
      } else {
        callBack();
      }
    };

    if (boundingElement) {
      boundingElement.current?.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (boundingElement) {
        boundingElement.current?.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }

      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, deps);
};

useScrollPositionDebounce.defaultProps = {
  deps: [],
  element: false,
  useWindow: false,
  wait: null,
  boundingElement: false,
};
