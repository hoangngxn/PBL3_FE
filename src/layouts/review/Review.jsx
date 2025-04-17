import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "../../assets/image/User.png";
import ReportContent from "../popup/reportContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <i key={`full-${i}`} className="fas fa-star text-[#FFAC34]"></i>
        ))}
      {halfStar && <i className="fas fa-star-half-stroke text-[#FFAC34]"></i>}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <i key={`empty-${i}`} className="fas fa-star text-gray-300"></i>
        ))}
    </div>
  );
};

const Review = ({ height, tutor_id }) => {
  const sorts = ["Từ mới - cũ", "Từ cũ - mới"];
  const sortRating = ["Giảm dần", "Tăng dần"];
  const [reviews, setReviews] = useState([]);
  const [showReportIndex, setShowReportIndex] = useState(null);
  const [showReportContentIndex, setShowReportContentIndex] = useState(null);
  const [valueSort, setValueSort] = useState("Từ mới - cũ");
  const [valueSortRating, setValueSortRating] = useState("");
  const [isClickSort, setIsClickSort] = useState(false);
  const [isClickSortRating, setIsClickSortRating] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(4);
  const [everageRating, setEverageRating] = useState();

  const handleClickSort = () => {
    setIsClickSort(!isClickSort);
  };

  const handleValueSort = (sort) => {
    setValueSort(sort);
    setIsClickSort(!isClickSort);
  };

  const handleClickSortRating = () => {
    setIsClickSortRating(!isClickSortRating);
  };

  const handleValueSortRating = (sort) => {
    setValueSortRating(sort);
    setIsClickSortRating(!isClickSortRating);
  };
  const loadMoreReviews = () => setVisibleReviews(visibleReviews + 4);
  const collapseReviews = () => setVisibleReviews(4);

  const filterReviews = () => {
    const sortedReviews = [...reviews];

    if (valueSort === "Từ mới - cũ") {
      sortedReviews.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else {
      sortedReviews.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    }

    if (valueSortRating === "Giảm dần") {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else {
      sortedReviews.sort((a, b) => a.rating - b.rating);
    }

    return sortedReviews;
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/api/class/feedback/${tutor_id}`
        );
        const data = await response.json();
        if (Array.isArray(data.feedbacks)) {
          console.log(data.feedbacks);
        } else {
          console.error("=============>:", data);
        }
        const formattedReviews = data.feedbacks
          .map((review, index) => ({
            id: review.feedback_id || index, // Use review.id if available, otherwise fallback to index for testing
            rating: review.rating,
            comment: review.description,
            username: review.parent_name,
            avatar: review.parent_avt
              ? `${import.meta.env.VITE_API_ENDPOINT}${review.parent_avt}`
              : Image,
            tutor_id: review.tutor_id,
            class_id: review.class_id,
            created_at: review.created_at,
            parent_id: review.parent_id,
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        console.log(formattedReviews);

        const score = data.average_rating;
        setEverageRating(score);
        setReviews(formattedReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, [tutor_id]);

  const toggleReportMenu = (id) => {
    setShowReportIndex(showReportIndex === id ? null : id);
    setShowReportContentIndex(null);
  };

  const openReportContent = (id) => {
    setShowReportIndex(null);
    setShowReportContentIndex(id);
  };
  const displayedReviews = filterReviews();
  return (
    <div className="flex flex-col w-full px-4 pb-6">
      <div className="flex items-center w-full">
        <label htmlFor="" className="font-bold">
          Sắp xếp theo
        </label>
        <div className="ml-4 relative flex items-center shadow-lg p-2 bg-white">
          <label className="text-[0.9rem]" htmlFor="">
            Theo thời gian:{" "}
          </label>
          <button
            className="cursor-pointer w-[6.5rem] text-[0.9rem] font-semibold flex justify-end items-center transition duration-300 rounded-xl hover:bg-primaryColorPink"
            onClick={handleClickSort}
          >
            {valueSort}
            {isClickSort ? (
              <i className="fa-solid fa-angle-up ml-2"></i>
            ) : (
              <i className="fa-solid fa-angle-down ml-2"></i>
            )}
          </button>
          {isClickSort && (
            <div
              className="absolute top-8 right-0 z-10 mt-1 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <ul>
                {sorts.map((sort, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => handleValueSort(sort)}
                      className="cursor-pointer text-[0.9rem] text-end p-2 hover:text-primaryColorPink"
                    >
                      {sort}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="h-6 border-l border-gray-600 mx-5"></div>
        <div className="relative flex items-center shadow-lg p-2 bg-white">
          <label className="text-[0.9rem]" htmlFor="">
            Theo điểm đánh giá:{" "}
          </label>
          <button
            className="cursor-pointer w-[6rem] text-[0.9rem] flex font-bold justify-end items-center transition duration-300 rounded-xl hover:bg-primaryColorPink"
            onClick={handleClickSortRating}
          >
            {valueSortRating}
            {isClickSortRating ? (
              <i className="fa-solid fa-angle-up ml-2"></i>
            ) : (
              <i className="fa-solid fa-angle-down ml-2"></i>
            )}
          </button>
          {isClickSortRating && (
            <div
              className="absolute top-8 right-0 z-10 mt-1 w-24 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <ul>
                {sortRating.map((sort, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => handleValueSortRating(sort)}
                      className="cursor-pointer text-[0.9rem] text-end p-2 hover:text-primaryColorPink"
                    >
                      {sort}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <p>Số sao trung bình:&nbsp;</p>
          <span className="font-bold">
            {everageRating ? everageRating.toFixed(1) : "N/A"}
          </span>
          <FontAwesomeIcon icon={faStar} className="text-[#F1C232]  w-6 h-6" />
        </div>
      </div>
      <div className="w-full border-t-2 border-gray-600 my-3"></div>
      <div
        className={`grid grid-cols-2 gap-5 ${height} overflow-y-scroll scrollbar scrollbar-thumb-white/30`}
      >
        {[0, 1].map((col) => (
          <div key={col} className="flex flex-col space-y-5">
            {displayedReviews
              .slice(0, visibleReviews)
              .filter((_, index) => index % 2 === col)
              .map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col bg-white border-b border-gray-200 rounded-lg px-6 py-4 shadow-xl"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <img
                        src={review.avatar}
                        alt={review.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <strong className="text-lg font-semibold ml-1">
                        {review.username}
                      </strong>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-2 text-[1.05rem] text-gray-600 font-semibold line-clamp-1 hover:line-clamp-none">
                    {review.comment}
                  </p>
                  <div className="flex w-full justify-between relative">
                    <p className="mt-3 text-[0.75rem] text-custom_gray">
                      {formatDate(review.created_at)}{" "}
                    </p>
                    <div>
                      <i
                        className={`fa-solid fa-ellipsis text-2xl cursor-pointer hover:text-black transition-all ${showReportIndex === review.id
                          ? "text-black"
                          : "text-slate-100"
                          }`}
                        onClick={() => toggleReportMenu(review.id)}
                      ></i>

                      {showReportIndex === review.id && (
                        <div className="bg-slate-100 absolute -right-6 top-8 p-1 rounded-md cursor-pointer shadow-md">
                          <div
                            className="flex gap-1 items-center p-1 hover:bg-slate-200 rounded-md text-[0.9rem]"
                            onClick={() => openReportContent(review.id)}
                          >
                            <i className="fa-solid fa-flag"></i>
                            <span>Report</span>
                          </div>
                        </div>
                      )}
                      {showReportContentIndex === review.id && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 z-40"></div>
                      )}
                      {showReportContentIndex === review.id && (
                        <div className="fixed inset-0 flex items-center justify-center z-40">
                          <ReportContent
                            onClose={() => setShowReportContentIndex(null)}
                            type="Đánh giá"
                            reportedPartyId={review.parent_id}
                            postId={review.id}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      {reviews.length > 0 && (visibleReviews < reviews.length ? (
        <button
          className="flex gap-2 items-center mt-4 self-center px-4 py-2 bg-transparent text-custom_darkblue text-shadow-md font-semibold transition duration-300 transform hover:scale-105"
          onClick={loadMoreReviews}
        >
          Xem thêm
          <i className="fa-solid fa-angle-down transition-transform transform duration-300 group-hover:rotate-180"></i>
        </button>
      ) : (
        <button
          className="flex gap-2 items-center mt-4 self-center px-4 py-2 text-custom_darkblue text-shadow-md font-semibold transition-all duration-300 transform hover:scale-105"
          onClick={collapseReviews}
        >
          Thu gọn
          <i className="fa-solid fa-angle-up transition-transform transform duration-300 group-hover:rotate-180"></i>
        </button>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

Review.propTypes = {
  height: PropTypes.string.isRequired,
  tutor_id: PropTypes.string.isRequired,
};

export default Review;
