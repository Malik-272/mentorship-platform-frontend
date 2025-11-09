import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { connectSocket, socket } from "./socket";
import { useNotificationContext } from "../../context/NotificationContext";
import toast from "react-hot-toast";

export default function SocketManager({ children }) {
  const { status } = useAuth();
  const {
    setNotifications,
    setNewNotifications
  } = useNotificationContext();

  useEffect(() => {
    if (status != "full"){
      return;
    }
    connectSocket();

    const handleSuccessfulConnection = () => {

      // updates the bell icon red dot indicator
      socket.on("updateNewNotifications", (newNotifications) => {
        setNewNotifications(newNotifications);
      });

      // updates existing notifications by adding the new one
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setNewNotifications(true);
      });
    };

    socket.on('connect', handleSuccessfulConnection);

    return () => {
      socket.off('connect');
      socket.off("notification");
      socket.off("updateNewNotifications");
      socket.disconnect();
    };
  }, [status, setNewNotifications, setNotifications]);

  return children;
}