import { useContext } from "react";
import { NotificationContext } from "../contexts/notificationContext";

export default function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider",
    );
  }
  return context;
}
