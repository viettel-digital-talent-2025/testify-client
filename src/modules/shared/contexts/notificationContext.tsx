"use client";
import { createContext } from "react";
import { notification } from "antd";
import type { NotificationArgsProps } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

interface CustomNotificationArgsProps extends NotificationArgsProps {
  notiType?: NotificationType;
}

type NotificationContextType = {
  notify: (config: CustomNotificationArgsProps) => void;
};

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [api, contextHolder] = notification.useNotification();
  const notify = (config: CustomNotificationArgsProps) => {
    api[config.notiType || "success"]({
      ...config,
      placement: "topRight",
      showProgress: true,
      duration: 3,
    });
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
}
