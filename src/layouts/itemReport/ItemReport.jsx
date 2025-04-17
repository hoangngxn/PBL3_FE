import PropTypes from "prop-types";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";
import User from "../../assets/image/User.png";
import { useState } from "react";
import FeedbackPopup from "../popup/FeedbackPopup";

const ItemReport = ({ report }) => {
  const { sessionToken } = useAppContext();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [feedbackDetails, setFeedbackDetails] = useState(null);

  const handleDeleteReport = async (report_id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/report/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            report_id: report_id,
            resolved: true,
          }),
        }
      );

      if (response.ok) {
        console.log("Report resolved successfully");
        window.location.reload();
      } else {
        console.error("Failed to resolve report");
      }
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  const handleViewPost = (post_id, comment_id, comments) => {
    navigate(`/admin/approved-posts/${post_id}`, {
      state: { comment_id, comments },
    });
  };

  const handleViewFeedBack = (feedback_id) => {
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/class/feedback/${feedback_id}/`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setFeedbackDetails(data.feedbacks);
        setIsPopupOpen(true);
        console.log("Fetched feedback details:", data.feedbacks);
      })

      .catch((error) => {
        console.error("Error fetching feedback details:", error);
      });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setFeedbackDetails(null);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 shadow-sm mb-6 bg-white w-[55rem] mx-auto">
      <div className="flex justify-between items-center border-b py-3 mb-4 bg-yellow-100 p-2 rounded-lg shadow-md">
        <div className="text-gray-700 font-semibold text-lg">
          Mã báo cáo:
          <span className="text-blue-700 underline ml-1">
            {report.report_id || "N/A"}
          </span>
        </div>
      </div>

      <div className=" flex justify-end">
        <div className="text-gray-500 text-sm">
          <span className="font-bold">Báo cáo lúc:</span>
          <span> {formatDate(report.created_at)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Reporter Information */}
        <div className="flex items-center">
          <img
            src={
              report.reporter_avt
                ? `${import.meta.env.VITE_API_ENDPOINT}${report.reporter_avt}`
                : User
            }
            alt="Reporter Avatar"
            className="w-12 h-12 rounded-full mr-3 object-cover border border-gray-500"
          />
          <div className="flex-1">
            <p className="text-gray-900 font-medium">
              {report.reporter_name || "N/A"}
            </p>
            <p className="text-gray-500 text-sm font-bold">Người báo cáo</p>
          </div>
        </div>

        {/* Reported Party Information */}
        <div className="flex items-center">
          <img
            src={
              report.reported_party_avt
                ? `${import.meta.env.VITE_API_ENDPOINT}${
                    report.reported_party_avt
                  }`
                : User
            }
            alt="Reported Party Avatar"
            className="w-12 h-12 rounded-full mr-3 object-cover border border-gray-500"
          />
          <div className="flex-1">
            <p className="text-gray-900 font-medium">
              {report.reported_party_name || "N/A"}
            </p>
            <p className="text-gray-500 text-sm font-bold">Bên bị báo cáo</p>
          </div>
        </div>

        {/* Report Details */}
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-semibold">Loại báo cáo:</p>
            <p className="text-red-600 font-bold text-lg">
              {report.type || "N/A"}
            </p>
          </div>
          <div>
            <p className="font-semibold">Mã bài đăng:</p>
            <p className="text-gray-900">{report.post_id || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Mã phản hồi:</p>
            <p className="text-gray-900">{report.feedback_id || "Không có"}</p>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <p className="font-semibold">Trạng thái:</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                report.resolved
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {report.resolved ? "Đã giải quyết" : "Chưa giải quyết"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="font-semibold text-gray-700">Mô tả:</p>
          <p className="text-gray-900">
            {report.description || "Không có mô tả"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-10 pt-5 space-x-3">
          <button
            className="text-white font-semibold bg-red-500 py-2 px-4 rounded-lg hover:bg-red-400"
            onClick={() => {
              if (
                window.confirm("Bạn có chắc chắn muốn xóa báo cáo này không?")
              ) {
                handleDeleteReport(report.report_id);
              }
            }}
          >
            Xóa báo cáo
          </button>

          {report.post_id && (
            <button
              className="text-white font-semibold bg-blue-700 py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => {
                console.log(
                  "Report comment:",
                  report.comment_id,
                  report.comments
                ); // Ghi log giá trị của report.comment
                handleViewPost(
                  report.post_id,
                  report.comment_id,
                  report.comments
                );
              }}
            >
              Xem bài đăng
            </button>
          )}

          {report.feedback_id && (
            <button
              className="text-white font-semibold bg-blue-700 py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => handleViewFeedBack(report.feedback_id)}
            >
              Xem phản hồi
            </button>
          )}
        </div>
      </div>
      {isPopupOpen && (
        <FeedbackPopup
          feedbackDetails={feedbackDetails}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

ItemReport.propTypes = {
  report: PropTypes.shape({
    report_id: PropTypes.string,
    description: PropTypes.string,
    created_at: PropTypes.string,
    resolved: PropTypes.bool,
    reporter_name: PropTypes.string,
    reporter_id: PropTypes.string,
    reported_party_id: PropTypes.string,
    reported_party_name: PropTypes.string,
    reporter_avt: PropTypes.string,
    reported_party_avt: PropTypes.string,
    type: PropTypes.string,
    post_id: PropTypes.string,
    feedback_id: PropTypes.string,
    comment_id: PropTypes.string,
    comments: PropTypes.array,
  }).isRequired,
};

export default ItemReport;
