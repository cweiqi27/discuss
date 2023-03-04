import { useInstantSearch } from "react-instantsearch-hooks-web";

type NoResultsBoundaryProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

const NoResultsBoundary = ({ fallback, children }: NoResultsBoundaryProps) => {
  const { results } = useInstantSearch();
  return !results.__isArtificial && results.nbHits === 0 ? (
    <>
      {fallback}
      <div hidden>{children}</div>
    </>
  ) : (
    <>{children}</>
  );
};

export default NoResultsBoundary;
