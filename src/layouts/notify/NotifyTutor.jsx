import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../AppProvider";

const NotifyTutor = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { id } = useAppContext();
  const [ws, setWs] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const websocket = new WebSocket(
      `${import.meta.env.VITE_API_ENDPOINT_NOTIFICATION}/ws/notifications/?user_id=${id}`
    );

    websocket.onopen = () => {
      console.log("WebSocket connection established");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "unread notifications") {
        setNotifications(response.notifications);
      } else if (response.type === "new_notification") {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          response.notification,
        ]);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      websocket.close();
    };
  }, [id]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleMarkAsRead = (notificationId) => {
    if (ws) {
      const message = {
        action: "mark_as_read",
        notification_ids: [notificationId],
      };
      ws.send(JSON.stringify(message));
    }

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notification_id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const translateMessage = (message) => {
    if (message.includes("You have received a feedback from")) {
      const parts = message.split("You have received a feedback from");
      return (
        <>
          <span className="font-bold text-lg">{parts[0]}</span>
          <span className="text-gray-500">Bạn đã nhận được phản hồi từ</span>
          <span className="text-md font-semibold text-blue-800">
            {parts[1]}
          </span>
        </>
      );
    }
    return message;
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full text-white"
      >
        <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-[25rem] bg-white rounded-lg shadow-lg z-10"
          ref={dropdownRef}
        >
          <div className="p-4">
            <ul className="mt-2 max-h-64 overflow-y-auto bg-white rounded-lg">
              {notifications.map((notification) => (
                <li
                  key={notification.notification_id}
                  className={`p-3 border-b flex items-start ${notification.read ? "bg-gray-200" : ""
                    }`}
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      {translateMessage(notification.message)}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      {notification.time}
                    </p>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() =>
                            handleMarkAsRead(notification.notification_id)
                          }
                          className="text-sm text-green-500 hover:text-green-600"
                        >
                          Đánh dấu đã xem
                        </button>
                      )}
                      {/* {notification.additional_information && (
                        <button
                          onClick={() =>
                            console.log(
                              `Thông tin bổ sung: ${JSON.stringify(
                                notification.additional_information
                              )}`
                            )
                          }
                          className="text-xs text-blue-500 hover:text-blue-600"
                        >
                          Xem thêm thông tin
                        </button>
                      )} */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifyTutor;
