import {
  ClearRefinements,
  useInstantSearch,
} from "react-instantsearch-hooks-web";

const NoResults = () => {
  const { indexUiState } = useInstantSearch();
  return (
    <div className="flex flex-col gap-2 p-8">
      <p className="text-center text-lg text-zinc-400">
        No results for{" "}
        <q className="font-semibold italic">{indexUiState.query}</q>.
      </p>
    </div>
  );
};

export default NoResults;
