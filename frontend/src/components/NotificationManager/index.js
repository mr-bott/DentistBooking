// NotificationManager.js
import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import Notification from '../Notification';
function NotificationManager() {
  const { notifications } = useNotification();

  return (
    <div>
      {notifications.map((message, index) => (
        <Notification key={index} message={message} />
      ))}
    </div>
  );
}

export default NotificationManager;
