import {
  Hits,
  SearchBox,
  ToggleRefinement,
  useInstantSearch,
} from "react-instantsearch-hooks-web";
import Spinner from "components/Spinner";
import NoResultsBoundary from "./NoResultsBoundary";
import NoResults from "./NoResults";
import EmptyQueryBoundary from "./EmptyQueryBoundary";
import EmptyQuery from "./EmptyQuery";
import { IconSearch, IconSquareX } from "@tabler/icons-react";
import HitWithStateAction from "./HitWithStateAction";
import { useHitState } from "store/searchStore";

type SearchBarProps = {
  search?: boolean;
};

const SearchBar = ({ search }: SearchBarProps) => {
  const showHit = useHitState((state) => state.isShowHit);
  const { status } = useInstantSearch();

  return (
    <div className="relative">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconSearch className="text-zinc-400" />
          <SearchBox
            placeholder="Search User"
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
          <ToggleRefinement attribute="type" off="User" className="hidden" />
        </div>
      </div>
      <div className="absolute top-6 left-1 z-10 mt-4 max-h-[50vh] w-full overflow-y-auto overscroll-y-auto bg-zinc-900">
        {status === "stalled" && <Spinner />}
        <EmptyQueryBoundary fallback={null}>
          <NoResultsBoundary fallback={<NoResults />}>
            {showHit && <Hits hitComponent={HitWithStateAction} />}
          </NoResultsBoundary>
        </EmptyQueryBoundary>
      </div>
    </div>
  );
};

export default SearchBar;
