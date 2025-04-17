import { useState } from "react";
import PropTypes from "prop-types";

const RatingPopup = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Đánh giá gia sư</h2>
        
        
        <div className="flex space-x-1 mb-4 justify-center">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <svg
                key={starValue}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(rating)}
                xmlns="http://www.w3.org/2000/svg"
                fill={starValue <= (hover || rating) ? "gold" : "gray"}
                viewBox="0 0 24 24"
                className="w-8 h-8 cursor-pointer transition duration-300"
              >
                <path d="M12 17.3l-6.2 3.9 1.6-7L2 9.3l7.1-.6L12 2.5l2.9 6.2 7.1.6-5.4 4.9 1.6 7L12 17.3z" />
              </svg>
            );
          })}
        </div>

        {/* Textarea để nhập đánh giá */}
        <textarea
          placeholder="Nhập đánh giá của bạn..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        {/* Nút xác nhận và đóng */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

// Xác định propTypes cho component
RatingPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default RatingPopup;
