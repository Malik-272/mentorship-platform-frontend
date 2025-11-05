import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { connectSocket, socket } from "./socket";
import toast from "react-hot-toast";
import { useNotificationContext } from "../../context/NotificationContext";

export default function SocketManager({ children }) {
  const { status } = useAuth();
  const { setNewNotifications } = useNotificationContext();

  useEffect(() => {
    if (status == "full") {
      connectSocket();

      socket.on('connect', () => {
        toast.success(`Connected to server successfully: ${socket.id}`);
      });

      // socket.on("notification", (content, redirectPath) => {

      // });

      socket.on("updateNewNotifications", (newNotifications) => {
        setNewNotifications(newNotifications);
      });

      return () => {
        // socket.off("notification");
        socket.off("notificationsUpdated");
        socket.disconnect();
      };
    }
  }, [status, setNewNotifications]);

  return children;
}