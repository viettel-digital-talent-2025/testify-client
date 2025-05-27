"use client";
import { ConfigProvider, App, theme as antdTheme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NotificationProvider } from "@/shared/contexts";
import { colors } from "@/shared/constants/colors";
import "@/shared/components/chartjs/config";

export const theme = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: colors.primary,
  },
  components: {
    Card: {
      bodyPadding: 12,
      headerPadding: 12,
    },
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
