import {
  Configure,
  Hits,
  InstantSearch,
  RefinementList,
  SearchBox,
  useInstantSearch,
} from "react-instantsearch-hooks-web";
import HitWithLink from "./HitWithLink";
import { Dispatch, SetStateAction, useEffect } from "react";
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
import { useHitState } from "store/searchStore";

// const searchClient = {
//   ...algoliaClient,
//   search(requests: MultipleQueriesQuery[]) {
//     return algoliaClient.search(requests);
//   },
// };

type SearchModalProps = {
  setSearch: Dispatch<SetStateAction<boolean>>;
};

const SearchModal = ({ setSearch }: SearchModalProps) => {
  const searchRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(searchRef, () => setSearch(false));
  const { status } = useInstantSearch();

  const updateShowHitFalse = useHitState((state) => state.updateShowHitFalse);
  const updateShowHitTrue = useHitState((state) => state.updateShowHitTrue);

  useEffect(() => {
    updateShowHitFalse();
    return () => updateShowHitTrue();
  }, [updateShowHitFalse, updateShowHitTrue]);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-zinc-900/70 pt-12 backdrop-blur">
        <motion.div
          className="mx-auto flex max-h-[80vh] max-w-[42rem] flex-col rounded border border-zinc-600 bg-zinc-800/80 p-4 shadow"
          ref={searchRef}
        >
          <div className="flex items-center">
            <IconSearch className="text-zinc-400" />
            <SearchBox
              placeholder="Search Discuss..."
              autoFocus
              resetIconComponent={({ classNames }) => (
                <IconSquareX className={classNames.resetIcon} />
              )}
              classNames={{
                root: "w-full",
                input:
                  "w-[75%] sm:w-[90%] mx-2 transition rounded px-3 py-1 border-2 border-zinc-800 focus:border-purple-400 bg-zinc-700 outline-none caret-zinc-400 text-zinc-300",
                submit: "hidden",
                resetIcon: "text-zinc-400 hover:text-zinc-300",
              }}
            />
          </div>
          <RefinementList
            attribute="type"
            classNames={{
              root: "mt-2",
              list: "flex overflow-x-auto gap-2",
              item: "text-zinc-400",
              selectedItem: "text-zinc-300 font-semibold",
              count: "ml-1 text-zinc-500 text-xs",
            }}
          />
          <div className="mt-4 w-full overflow-y-auto">
            {status === "stalled" && <Spinner />}
            <EmptyQueryBoundary fallback={<EmptyQuery />}>
              <NoResultsBoundary fallback={<NoResults />}>
                <Hits hitComponent={HitWithLink} />
              </NoResultsBoundary>
            </EmptyQueryBoundary>
          </div>
          <CustomPoweredBy />
        </motion.div>
      </div>
    </>
  );
};

export default SearchModal;
