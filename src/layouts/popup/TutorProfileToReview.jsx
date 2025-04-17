import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useAppContext } from "../../AppProvider";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import TutorProfile from "./TutorProfile";
const TutorProfileToReview = ({ tutor_id, idPost, idParent, onClose, }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const { sessionToken } = useAppContext();
    console.log("id post", idPost);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_ENDPOINT}/api/class/feedback/`,
                {
                    class_id: idPost,
                    parent_id: idParent,
                    tutor_id: tutor_id,
                    rating: rating,
                    description: feedback,
                    created_at: Date.now()
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("OK");
            toast.success("Đánh giá thành công", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            onClose();
        } catch (error) {

            console.error("Đã xảy ra lỗi khi gửi đánh giá:", error);
        }
    };
    if (tutor_id === null) return (
        alert('Tài khoản gia sư đã bị khóa hoặc không hoạt động')
    );
    return (
        <TutorProfile
            tutor_id={tutor_id}
            onClose={onClose}
            component='review'
        >
            <div className="flex flex-col p-8 py-8 rounded-lg shadow-lg w-[70%] mt-5 border-2 border-slate-300">
                <div className="flex space-x-5 mb-4 justify-center">
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

                <textarea
                    placeholder="Nhập đánh giá của bạn..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    maxLength={200}
                    className="w-full text-[0.9rem] h-[100px] p-2 border border-gray-300 rounded resize-none focus:outline-none"
                />
                <div className="remaining1 text-slate-500 text-sm self-end mt-2">{feedback.length}/200</div>

                <div className="flex justify-end space-x-2 mt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </TutorProfile>
    );
};

TutorProfileToReview.propTypes = {
    tutor_id: PropTypes.string.isRequired,
    idParent: PropTypes.string.isRequired,
    idPost: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TutorProfileToReview;
