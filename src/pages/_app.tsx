import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NextNProgress from "nextjs-progressbar";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { ALGOLIA_INDEX_NAME, searchClient } from "utils/constants";
import { InstantSearch } from "react-instantsearch-hooks-web";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <NextNProgress
          color="rgb(168,85,247)"
          options={{ showSpinner: false }}
        />
        <InstantSearch
          searchClient={searchClient}
          indexName={ALGOLIA_INDEX_NAME}
        >
          <Component {...pageProps} />
        </InstantSearch>
        <Analytics />
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default trpc.withTRPC(MyApp);
