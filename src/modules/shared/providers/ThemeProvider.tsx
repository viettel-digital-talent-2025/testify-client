import { ConfigProvider, App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NotificationProvider } from "@/modules/shared/contexts";
import { colors } from "@/modules/shared/constants/colors";
import "@/modules/shared/components/chartjs/config";

export const theme = {
  token: {
    colorPrimary: colors.primary,
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
