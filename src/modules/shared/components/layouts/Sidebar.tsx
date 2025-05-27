"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardOutlined,
  ScheduleOutlined,
  ExperimentOutlined,
  BugOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { colors } from "@/shared/constants/colors";
import Sider from "antd/es/layout/Sider";
import Title from "antd/es/typography/Title";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const menuItems = [
    {
      key: "performance",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => router.push("/performance"),
    },
    {
      key: "scenarios",
      icon: <ExperimentOutlined />,
      label: "Scenarios",
      onClick: () => router.push("/scenarios"),
    },
    {
      key: "schedule",
      icon: <ScheduleOutlined />,
      label: "Schedule",
      onClick: () => router.push("/schedule"),
    },
    {
      key: "bottlenecks",
      icon: <BugOutlined />,
      label: "Bottlenecks",
      onClick: () => router.push("/bottlenecks"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => router.push("/settings"),
    },
  ];

  return (
    <Sider
      theme="dark"
      width={175}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 64, // Height of the header
        bottom: 0,
        backgroundColor: colors.dark,
      }}
    >
      <Title level={3} style={{ color: colors.text, margin: 8 }}>
        <Link href="/" style={{ color: colors.text }}>
          Testify
        </Link>
      </Title>
      <Menu
        theme="dark"
        mode="vertical"
        defaultSelectedKeys={["performance"]}
        style={{
          height: "100%",
          borderRight: 0,
          color: colors.text,
          backgroundColor: colors.dark,
        }}
        items={menuItems}
      />
    </Sider>
  );
}
