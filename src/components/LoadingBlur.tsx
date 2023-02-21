import React from "react";
import Spinner from "./Spinner";

const LoadingBlur = () => {
  return (
    <div className="bg-zinc-900/-20 absolute top-0 left-0 grid h-full w-full place-items-center backdrop-blur-sm">
      <Spinner />
    </div>
  );
};

export default LoadingBlur;
