import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [newNotifications, setNewNotifications] = useState(false); // new notifications indicator (the red dot on the bell icon)
  const [notifications, setNotifications] = useState([]);

  return (
    <NotificationContext.Provider value={{
      newNotifications,
      setNewNotifications,
      notifications,
      setNotifications,
      }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => useContext(NotificationContext);
