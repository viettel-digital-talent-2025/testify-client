"use client";
import { useLogoutMutation } from "@/auth/apis/authApi";
import { selectUser } from "@/auth/slices/authSlide";
import { colors } from "@/shared/constants/colors";
import { useAppSelector } from "@/shared/hooks";
import {
  AppstoreOutlined,
  BugOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  RocketOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, MenuProps } from "antd";
import { Header as AntHeader } from "antd/es/layout/layout";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
        zIndex: 100,
        width: "100%",
        height: "max-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.dark,
        borderBottom: `1px solid ${colors.border}`,
        padding: "0 24px",
      }}
    >
      <Title
        level={2}
        style={{
          flex: 1,
          margin: 0,
          textWrap: "nowrap",
        }}
      >
        <Link href="/" style={{ color: colors.primary }}>
          Testify
        </Link>
      </Title>
      <Menu
        mode="horizontal"
        selectedKeys={[current]}
        items={user ? UserItems : GuestItems}
        style={{ flex: 3, width: "100%", justifyContent: "center" }}
      />
      <div className="flex flex-1 justify-end">
        {user ? <UserMenu /> : <GuestMenu />}
      </div>
    </AntHeader>
  );
}

const GuestMenu = () => {
  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button type="primary" icon={<LoginOutlined />}>
          Login
        </Button>
      </Link>
      <Link href="/register">
        <Button icon={<UserOutlined />}>Register</Button>
      </Link>
    </div>
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
    <div className="flex items-center gap-2">
      <Text>Hi, {user?.firstname}</Text>
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
    </div>
  );
};
