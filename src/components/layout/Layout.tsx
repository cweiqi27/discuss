import Head from "next/head";
import Script from "next/script";
import TimelineContainer from "./TimelineContainer";
import Header from "./Header";
import MainContainer from "./MainContainer";
import ProfileContainer from "./ProfileContainer";
import SingleContainer from "./SingleContainer";

type LayoutProps = {
  type: "TIMELINE" | "PROFILE" | "SINGLE";
  children: React.ReactNode;
};

const containerLookup = {
  TIMELINE: TimelineContainer,
  PROFILE: ProfileContainer,
  SINGLE: SingleContainer,
} as const;

const Layout = (props: LayoutProps) => {
  const Container = containerLookup[props.type];
  return (
    <>
      {/* <Script src="https://js.pusher.com/7.2.0/pusher.min.js" /> */}
      <Head>
        <title>Discuss</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer>
        <Header />
        <Container>{props.children}</Container>
      </MainContainer>
    </>
  );
};

export default Layout;
