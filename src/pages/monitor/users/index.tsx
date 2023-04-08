import SearchBar from "components/algolia/SearchBar";
import Layout from "components/layout/Layout";
import type { NextPage } from "next";
import Link from "next/link";

const MonitorUserPage: NextPage = (props) => {
  return (
    <Layout type="TIMELINE">
      <h1 className="text-3xl font-extrabold text-zinc-300">MONITOR</h1>
      <div className="row-start-2 flex gap-2">
        <Link
          href="/monitor"
          className="text-xl font-bold uppercase text-zinc-500 hover:text-zinc-400"
        >
          Overview
        </Link>
        <div className="cursor-default text-xl font-bold uppercase text-zinc-300">
          User
        </div>
      </div>
      <div className="row-start-3 flex flex-col gap-4 sm:min-w-[90vw]">
        <div className="flex">
          <SearchBar hitType="MONITOR" />
        </div>
      </div>
    </Layout>
  );
};

export default MonitorUserPage;
