import { HomeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-full min-h-screen items-center justify-center"
      style={{
        background: "url('/auth-bg.jpg') no-repeat center center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 z-0 bg-black/35" />
      <div className="w-full max-w-md">{children}</div>

      <Link href="/" className="absolute top-4 right-4">
        <Button shape="circle" icon={<HomeOutlined />}></Button>
      </Link>
    </div>
  );
}
