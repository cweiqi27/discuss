import Head from "next/head";

type SeoProps = {
  title?: string | null;
  desc?: string | null;
  url: string;
  type: "article" | "website" | "profile";
  noIndex?: boolean;
};

const Seo = ({ title, desc, url, type, noIndex }: SeoProps) => {
  const fullTitle = title ? title + " | Discuss" : undefined;
  return (
    <Head>
      <title>{fullTitle ?? "Discuss"}</title>
      <meta
        name="description"
        content={
          desc ?? "Scuffed dark theme forum website for your scuffy needs"
        }
      />
      <meta property="og:type" content={type} />
      <meta
        name="og:title"
        property="og:title"
        content={fullTitle ?? "Discuss"}
      />
      <meta
        name="og:description"
        property="og:description"
        content={
          desc ?? "Scuffed dark theme forum website for your scuffy needs"
        }
      />
      <meta property="og:site_name" content="Discuss" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="/discuss-logo_white.png" />
      {/* <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="" />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:site" content="" />
      <meta name="twitter:image" content="" />
      <meta name="twitter:creator" content="" /> */}
      {noIndex && <meta name="robot" content="noindex" />}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Seo;
