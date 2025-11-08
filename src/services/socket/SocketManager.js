import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { connectSocket, socket } from "./socket";
import toast from "react-hot-toast";
import { useNotificationContext } from "../../context/NotificationContext";

export default function SocketManager({ children }) {
  const { status } = useAuth();
  const {
    setNotifications,
    setNewNotifications
  } = useNotificationContext();

  useEffect(() => {
    if (status == "full") {
      connectSocket();

      socket.on('connect', () => {
        toast.success(`Connected to server successfully: ${socket.id}`);
      });

      // updates the bell icon red dot indicator
      socket.on("updateNewNotifications", (newNotifications) => {
        setNewNotifications(newNotifications);
      });

      // updates existing notifications by adding the new one
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setNewNotifications(true);
      });

      return () => {
        socket.off("notification");
        socket.off("updateNewNotifications");
        socket.disconnect();
      };
    }
  }, [status, setNewNotifications, setNotifications]);

  return children;
}