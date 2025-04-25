// Notification.js
import React, { useEffect } from 'react';
import './notification.css';

function Notification({ message }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // The notification will disappear after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [message]);

  return (
    <div className="notification">
      <span>{message}</span>
    </div>
  );
}

export default Notification;
