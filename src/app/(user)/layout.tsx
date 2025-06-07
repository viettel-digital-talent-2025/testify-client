import { GlobalBottlenecksAlert } from "@/bottlenecks/components/sse";
import { GlobalConnectionStatus } from "@/scenarios/components/common";
import { Header } from "@/shared/components/layouts";
import { colors } from "@/shared/constants/colors";
import { Layout } from "antd";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header />
        <Layout style={{ marginTop: 64, backgroundColor: colors.dark }}>
          {children}
        </Layout>
      </Layout>
      <GlobalConnectionStatus />
      <GlobalBottlenecksAlert />
    </Layout>
  );
}
