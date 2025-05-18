"use client";
import { ConfigProvider, App, notification } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NotificationProvider } from "@/modules/shared/contexts";
import "@/modules/shared/chartjs/config";

notification.config({
  placement: "topRight",
  duration: 3,
  showProgress: true,
});

export const theme = {
  token: {
    colorPrimary: "#ee0033",
  },
  components: {
    // Card: {
    //   bodyPadding: 12,
    //   headerPadding: 12,
    // },
  },
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <App>
        <NotificationProvider>
          <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </NotificationProvider>
      </App>
    </AntdRegistry>
  );
}
