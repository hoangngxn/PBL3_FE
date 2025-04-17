import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheckCircle,
  faExclamationCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";

const NotifyAdmin = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { id } = useAppContext();
  const [ws, setWs] = useState(null);
  let navigate = useNavigate();
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

  const handleGoToReport = (reportId) => {
    navigate(`/admin/manage-report/${reportId}`);
    setIsDropdownOpen(false);
  };

  const handleGoToPost = (postId) => {
    navigate(`/admin/pending-posts/${postId}`);
    setIsDropdownOpen(false);
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full text-white transition duration-300"
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
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-[30rem] bg-white rounded-xl shadow-lg z-10 border-[1px] border-gray-400 border-solid"
        >
          <div className="p-4">
            <ul className="mt-2 max-h-64 overflow-y-auto bg-white rounded-lg">
              {notifications
                .slice()
                .reverse()
                .map((notification) => (
                  <li
                    key={notification.notification_id}
                    className={`p-3 border-b flex items-start ${notification.read ? "bg-gray-200" : "bg-white"
                      } hover:bg-gray-100 transition duration-300`}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_ENDPOINT}${notification.additional_information?.reporter_avatar ||
                        notification.additional_information?.parent_avatar
                        }`}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full mr-3 object-cover border-[1px] border-gray-400 border-solid"
                    />
                    <div className="flex-1">
                      {notification.additional_information?.report_id ? (
                        <>
                          <p className="text-md font-semibold text-blue-800">
                            {notification.message.split("has reported user")[0]}{" "}
                            <span className="text-gray-500">
                              đã báo cáo người dùng{" "}
                            </span>
                            {notification.message.split("has reported user")[1]}{" "}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            {notification.time}
                          </p>
                          <div className="flex justify-between mt-2">
                            <button
                              onClick={() =>
                                handleGoToReport(
                                  notification.additional_information.report_id
                                )
                              }
                              className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                            >
                              <FontAwesomeIcon
                                icon={faExclamationCircle}
                                className="mr-1"
                              />
                              Đi đến báo cáo
                            </button>
                            {!notification.read && (
                              <button
                                onClick={() =>
                                  handleMarkAsRead(notification.notification_id)
                                }
                                className="text-sm text-green-500 hover:text-green-600 flex items-center"
                              >
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  className="mr-1"
                                />
                                Đánh dấu đã xem
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-md font-semibold text-blue-800">
                            {notification.message.split("has created a new")[0]}{" "}
                            <span className="text-gray-500">
                              đã tạo bài viết mới
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            {notification.time}
                          </p>
                          <div className="flex justify-between mt-2">
                            <button
                              onClick={() =>
                                handleGoToPost(
                                  notification.additional_information.post_id
                                )
                              }
                              className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                            >
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="mr-1"
                              />
                              Đi đến bài viết
                            </button>
                            {!notification.read && (
                              <button
                                onClick={() =>
                                  handleMarkAsRead(notification.notification_id)
                                }
                                className="text-sm text-green-500 hover:text-green-600 flex items-center"
                              >
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  className="mr-1"
                                />
                                Đánh dấu đã xem
                              </button>
                            )}
                          </div>
                        </>
                      )}
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

export default NotifyAdmin;
