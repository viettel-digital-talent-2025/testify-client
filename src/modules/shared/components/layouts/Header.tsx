"use client";
import { Dropdown, Menu, MenuProps, Avatar, Button, Space } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { Header as AntHeader } from "antd/es/layout/layout";
import { colors } from "@/modules/shared/constants/colors";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import {
  DashboardOutlined,
  ExperimentOutlined,
  ScheduleOutlined,
  BugOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  AppstoreOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@/modules/shared/hooks";
import { selectUser } from "@/modules/auth/redux/authSlide";
import { useLogoutMutation } from "@/modules/auth/redux/authApi";

const UserItems: MenuProps["items"] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: "scenarios",
    icon: <ExperimentOutlined />,
    label: <Link href="/scenarios">Test Scenarios</Link>,
  },
  {
    key: "schedule",
    icon: <ScheduleOutlined />,
    label: <Link href="/schedule">Schedule</Link>,
  },
  {
    key: "bottlenecks",
    icon: <BugOutlined />,
    label: <Link href="/bottlenecks">Bottlenecks</Link>,
  },
];

const GuestItems: MenuProps["items"] = [
  {
    key: "hero",
    icon: <HomeOutlined />,
    label: <Link href="#hero">Overview</Link>,
  },
  {
    key: "features",
    icon: <AppstoreOutlined />,
    label: <Link href="#features">Features</Link>,
  },
  {
    key: "benefits",
    icon: <RocketOutlined />,
    label: <Link href="#benefits">Workflow</Link>,
  },
  {
    key: "cta",
    icon: <CheckCircleOutlined />,
    label: <Link href="#cta">Get Started</Link>,
  },
];

export default function Header() {
  const pathname = usePathname();
  const current = pathname === "/" ? "" : pathname.split("/")[1];
  const user = useAppSelector(selectUser);

  return (
    <AntHeader
      style={{
        position: "fixed",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderBottom: `1px solid ${colors.secondary}`,
        padding: "0 24px",
      }}
    >
      <Title
        level={2}
        style={{
          flex: 1,
          margin: 0,
          textWrap: "nowrap",
          color: colors.primary,
        }}
      >
        Testify
      </Title>
      <Menu
        mode="horizontal"
        selectedKeys={[current]}
        items={user ? UserItems : GuestItems}
        style={{ flex: 3, width: "100%", justifyContent: "center" }}
      />
      {user ? <UserMenu /> : <GuestMenu />}
    </AntHeader>
  );
}

const GuestMenu = () => {
  return (
    <Space style={{ flex: 1, width: "100%", justifyContent: "end" }}>
      <Link href="/login">
        <Button type="primary" icon={<LoginOutlined />}>
          Login
        </Button>
      </Link>
      <Link href="/register">
        <Button icon={<UserOutlined />}>Register</Button>
      </Link>
    </Space>
  );
};

const UserMenu = () => {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const [logout] = useLogoutMutation();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout();
      router.push("/login");
    }
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <Dropdown
      menu={{ items: dropdownItems, onClick: handleMenuClick }}
      trigger={["click"]}
    >
      <Avatar
        style={{
          backgroundColor: colors.primary,
          color: "white",
          cursor: "pointer",
        }}
      >
        {user?.firstname?.[0]?.toUpperCase() || <UserOutlined />}
      </Avatar>
    </Dropdown>
  );
};
