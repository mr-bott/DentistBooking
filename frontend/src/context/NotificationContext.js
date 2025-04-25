// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const NotificationContext = createContext();

// Provider component to wrap the app
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      message,
    ]);

    // Remove the notification after 3 seconds
    setTimeout(() => {
      setNotifications((prevNotifications) => prevNotifications.slice(1));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);
