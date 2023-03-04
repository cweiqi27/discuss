import { useInstantSearch } from "react-instantsearch-hooks-web";

type EmptyQueryBoundaryProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

const EmptyQueryBoundary = ({
  fallback,
  children,
}: EmptyQueryBoundaryProps) => {
  const { indexUiState } = useInstantSearch();
  return <>{!indexUiState.query ? fallback : children}</>;
};

export default EmptyQueryBoundary;
