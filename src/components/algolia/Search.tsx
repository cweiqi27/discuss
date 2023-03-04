import algoliasearch from "algoliasearch/lite";
import {
  Hits,
  InfiniteHits,
  InstantSearch,
  PoweredBy,
  SearchBox,
  useInstantSearch,
} from "react-instantsearch-hooks-web";
import Hit from "./Hit";
import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import Spinner from "components/Spinner";
import NoResultsBoundary from "./NoResultsBoundary";
import NoResults from "./NoResults";
import EmptyQueryBoundary from "./EmptyQueryBoundary";
import EmptyQuery from "./EmptyQuery";
import { useOnClickOutside } from "usehooks-ts";
import { motion } from "framer-motion";
import { IconSearch, IconSquareX } from "@tabler/icons-react";
import CustomPoweredBy from "./CustomPoweredBy";

// const searchClient = {
//   ...algoliaClient,
//   search(requests: MultipleQueriesQuery[]) {
//     return algoliaClient.search(requests);
//   },
// };

type SearchProps = {
  search: boolean;
  setSearch: Dispatch<SetStateAction<boolean>>;
};

const Search = ({ search, setSearch }: SearchProps) => {
  const searchRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(searchRef, () => setSearch(false));

  const { status } = useInstantSearch();
  return (
    <>
      {search && (
        <div className="fixed inset-0 z-50 bg-zinc-900/70 pt-12 backdrop-blur">
          <motion.div
            className="mx-auto flex max-h-[80vh] max-w-[42rem] flex-col items-center rounded border border-zinc-600 bg-zinc-800/80 p-4 shadow"
            ref={searchRef}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <IconSearch className="text-zinc-400" />
                <SearchBox
                  placeholder="Search Discuss&#8482;"
                  autoFocus
                  resetIconComponent={({ classNames }) => (
                    <IconSquareX className={classNames.resetIcon} />
                  )}
                  classNames={{
                    root: "",
                    input:
                      "transition rounded px-3 py-1 border-2 border-zinc-800 focus:border-purple-400 bg-zinc-700 outline-none caret-zinc-400 text-zinc-300",
                    submit: "hidden",
                    resetIcon: "text-zinc-400",
                  }}
                />
              </div>
            </div>
            <div className="mt-4 w-full overflow-y-auto">
              {status === "stalled" && <Spinner />}
              <EmptyQueryBoundary fallback={<EmptyQuery />}>
                <NoResultsBoundary fallback={<NoResults />}>
                  <Hits hitComponent={Hit} />
                </NoResultsBoundary>
              </EmptyQueryBoundary>
            </div>
            <CustomPoweredBy />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Search;
