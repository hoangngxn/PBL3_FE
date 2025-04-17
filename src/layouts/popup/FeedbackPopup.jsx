import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/solid";

const FeedbackPopup = ({ feedbackDetails, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Phản hồi
        </h2>
        {feedbackDetails ? (
          <div>
            <div className="flex items-center mb-4">
              <img
                src={
                  `${import.meta.env.VITE_API_ENDPOINT}` +
                  feedbackDetails.parent_avt
                }
                alt="Parent Avatar"
                className="w-16 h-16 rounded-full mr-4 shadow-md object-cover border border-gray-200"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {feedbackDetails.parent_name}
                </h3>
                <div className="flex flex-row gap-[4rem]">
                  <div className="text-sm italic text-gray-400">
                    Phụ huynh đã đánh giá
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((star, index) => {
                      const ratingValue = index + 1;
                      return (
                        <svg
                          key={index}
                          className={`w-5 h-5 ${
                            ratingValue <= feedbackDetails.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                        </svg>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                Nội dung phản hồi
              </h3>
            </div>

            <p className="mb-4 p-4 bg-gray-100 rounded-lg text-gray-800">
              {feedbackDetails.description}
            </p>
            <p className="text-gray-500 text-sm text-right">
              Đã phản hồi lúc:{" "}
              {new Date(feedbackDetails.created_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

FeedbackPopup.propTypes = {
  feedbackDetails: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default FeedbackPopup;
