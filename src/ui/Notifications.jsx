import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGetNotifications } from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { socket } from '../services/socket/socket';
import { useNotificationContext } from '../context/NotificationContext';

export default function NotificationDropdown() {
  const {
    newNotifications,
    setNewNotifications,
    notifications,
    setNotifications,
  } = useNotificationContext();
  const navigate = useNavigate();
  const { status } = useAuth();
  const { data, isLoading, refetch } = useGetNotifications({
    enabled: false, // we'll manually trigger it
  });

  useEffect(() => {
    if (status === 'full') {
      refetch();
    }
  }, [status, refetch]);

  // Only update state inside useEffect to avoid render loop
  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications);
      setNewNotifications(data.newNotifications || false);
    }
  }, [data, setNotifications, setNewNotifications]);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {status === 'full' && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            {newNotifications && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
              >
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Notifications
                  </h3>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      You don't have any notifications
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() =>{
                          setOpen(false);
                          n.isRead = true;
                          socket.emit('readNotification', n.id);
                          navigate(n.redirectPath);
                        }}
                        className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors duration-150 ${
                          !n.isRead
                            ? 'bg-blue-50 dark:bg-gray-800/70 hover:bg-blue-100 dark:hover:bg-gray-700'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            !n.isRead
                              ? 'font-semibold text-gray-900 dark:text-white'
                              : 'text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {n.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <button className="w-full py-2 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  View all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
