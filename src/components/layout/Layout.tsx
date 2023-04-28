import TimelineContainer from "./TimelineContainer";
import Header from "./Header";
import MainContainer from "./MainContainer";
import DoubleContainer from "./DoubleContainer";
import SingleContainer from "./SingleContainer";
import Footer from "./Footer";

type LayoutProps = {
  type: "TIMELINE" | "DOUBLE" | "SINGLE";
  children: React.ReactNode;
};

const containerLookup = {
  TIMELINE: TimelineContainer,
  DOUBLE: DoubleContainer,
  SINGLE: SingleContainer,
} as const;

const Layout = ({ type, children }: LayoutProps) => {
  const Container = containerLookup[type];
  return (
    <>
      {type !== "SINGLE" ? (
        <MainContainer>
          <Header />
          <Container>{children}</Container>
          <Footer />
        </MainContainer>
      ) : (
        <Container>{children}</Container>
      )}
    </>
  );
};

export default Layout;
