import Layout from "components/layout/Layout";
import type { NextPage } from "next";

const MonitorPage: NextPage = (props) => {
  return (
    <Layout type="DOUBLE">
      <section>monitor</section>
      <section>another monitor</section>
    </Layout>
  );
};

export default MonitorPage;
