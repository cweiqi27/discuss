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
import HitMonitorUser from "./HitMonitorUser";
import { useHitState } from "store/searchStore";
import HitManageUser from "./HitManageUser";

type SearchBarProps = {
  hitType: "MONITOR" | "MANAGEMENT";
};

const SearchBar = ({ hitType }: SearchBarProps) => {
  const showHit = useHitState((state) => state.isShowHit);
  const { status } = useInstantSearch();

  return (
    <>
      <div className="relative flex items-center">
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
            resetIcon: "text-zinc-400 items-self",
          }}
        />
        <ToggleRefinement attribute="type" off="User" className="hidden" />
        <div className="absolute top-6 left-0 z-10 mt-4 max-h-[50vh] w-full overflow-y-auto overscroll-y-auto">
          {status === "stalled" && <Spinner />}
          {hitType === "MONITOR" ? (
            <EmptyQueryBoundary fallback={null}>
              <NoResultsBoundary
                fallback={
                  <div className="rounded border border-zinc-700 bg-zinc-900/70 p-2 backdrop-blur-sm">
                    <NoResults />
                  </div>
                }
              >
                <div className="rounded border border-zinc-700 bg-zinc-900/70 p-2 backdrop-blur-sm">
                  <h2 className="mb-2 text-xl font-bold text-zinc-300">
                    Users
                  </h2>
                  <Hits hitComponent={HitMonitorUser} />
                </div>
              </NoResultsBoundary>
            </EmptyQueryBoundary>
          ) : (
            <NoResultsBoundary
              fallback={
                <div className="rounded border border-zinc-700 bg-zinc-900/70 p-2 backdrop-blur-sm">
                  <NoResults />
                </div>
              }
            >
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {showHit && <Hits hitComponent={HitManageUser} />}
              </div>
            </NoResultsBoundary>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
