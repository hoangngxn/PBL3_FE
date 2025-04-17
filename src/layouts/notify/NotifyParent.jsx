import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faTimes,
  faGraduationCap,
  faCalendarAlt,
  faHourglassHalf,
  faMoneyBillWave,
  faUsers,
  faBook,
  faBookOpen,
  faFileAlt,
  faMapMarkerAlt,
  faClock,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { FaExclamation } from "react-icons/fa";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";

const NotifyParent = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
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

  const handleGoToPost = (postId) => {
    // to={`/parent/detailPost/${parent.post_id}`}
    navigate(`/parent/detailPost/${postId}`);
    setIsDropdownOpen(false);
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
  };

  const closePopup = () => {
    setSelectedPost(null);
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const translate = (message) => {
    if (message === "Your post has been approved") {
      return "Bài đăng của bạn đã được duyệt";
    } else {
      return message;
    }
  };

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
                      src={
                        notification.additional_information?.avatar ||
                        "https://thumbs.dreamstime.com/b/account-vector-icon-user-illustration-sign-man-symbol-logo-account-vector-icon-user-illustration-sign-man-symbol-logo-can-be-228346109.jpg"
                      }
                      alt="Avatar"
                      className="h-12 w-12 rounded-full mr-3 object-cover border-[1px] border-gray-400 border-solid"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        {/* {notification.message} */}
                        {translate(notification.message)}
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
                        {notification.additional_information?.post_id &&
                          notification.message ===
                          "Your post has been approved" && (
                            <button
                              onClick={() =>
                                handleGoToPost(
                                  notification.additional_information.post_id
                                )
                              }
                              className="text-sm text-blue-500 hover:text-blue-600"
                            >
                              Đi đến bài đăng
                            </button>
                          )}
                        {notification.additional_information?.post && (
                          <button
                            onClick={() =>
                              handleViewPost(
                                notification.additional_information.post
                              )
                            }
                            className="text-sm text-blue-500 hover:text-blue-600"
                          >
                            Xem lại bài đăng
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-[70rem] h-[40rem] overflow-auto relative z-100 animate-fade-in">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>

            {/* Header */}
            <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
              <FontAwesomeIcon icon={faBook} className="mr-2 text-blue-500" />
              Thông tin bài đăng
            </h2>

            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={`${import.meta.env.VITE_API_ENDPOINT}${selectedPost.avatar
                  }`}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-4 border-blue-500 shadow-md object-cover"
              />
              <p className="text-lg font-semibold text-gray-800">
                Người đăng:{" "}
                <span className="text-blue-600">
                  {selectedPost.parent_name}
                </span>
              </p>
            </div>

            {/* Post Details */}
            <div className="space-y-4">
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="text-gray-500 mr-3"
                />
                <p className="text-lg font-semibold text-gray-800">
                  Môn học:{" "}
                  <span className="text-blue-600">{selectedPost.subject}</span>
                </p>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-gray-500 mr-3"
                />
                <p className="text-sm text-gray-600">
                  {selectedPost.description}
                </p>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-gray-500 mr-3"
                />
                <p className="text-sm text-gray-600">
                  Địa chỉ:{" "}
                  <span className="font-semibold">{selectedPost.address}</span>
                </p>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-gray-500 mr-3"
                />
                <p className="text-sm text-gray-600">
                  Thời gian tạo:{" "}
                  <span>
                    {new Date(selectedPost.created_at).toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faSyncAlt}
                  className="text-gray-500 mr-3"
                />
                <p className="text-sm text-gray-600">
                  Cập nhật lần cuối:{" "}
                  <span>
                    {new Date(selectedPost.last_updated).toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="flex items-center">
                <FaExclamation className="text-gray-500 mr-3" />
                <p className="text-sm text-gray-600">
                  Trạng thái bài đăng trước đó:{" "}
                  <span className="font-semibold">{selectedPost.status}</span>
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-3 text-sm text-gray-600 mt-4">
              <p>
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className="text-gray-500 mr-2"
                />
                Trình độ học sinh mong muốn:{" "}
                <span className="font-semibold">
                  {selectedPost.background_desired}
                </span>
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-gray-500 mr-2"
                />
                Số buổi học mỗi tuần:{" "}
                <span className="font-semibold">
                  {selectedPost.session_per_week}
                </span>
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faHourglassHalf}
                  className="text-gray-500 mr-2"
                />
                Thời gian mỗi buổi học:{" "}
                <span className="font-semibold">
                  {selectedPost.duration} giờ
                </span>
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  className="text-gray-500 mr-2"
                />
                Học phí mỗi buổi:{" "}
                <span className="font-semibold">
                  {selectedPost.wage_per_session.toLocaleString()} VNĐ
                </span>
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-gray-500 mr-2"
                />
                Số học sinh:{" "}
                <span className="font-semibold">
                  {selectedPost.student_number}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifyParent;
