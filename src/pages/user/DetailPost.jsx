import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAppContext } from "../../AppProvider";
import Popup from "reactjs-popup";

import Parent from "../../layouts/PageAuthorization/parent/parent";
import Panel from "../../layouts/panel/Panel";
import Img3 from "../../assets/image/medal.png";
import UserImage from "../../assets/image/User.png";
import ClassTimeDetail from "../../layouts/popup/classTime_Popup";
import TutorProfile from "../../layouts/popup/TutorProfile";
import ReviewTutor from "../../layouts/popup/reviewTutor";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailPost = () => {
  let navigate = useNavigate();
  const [dataPost, setDataPost] = useState({});
  const [sortedRegistrations, setSortedRegistrations] = useState([]);
  const { sessionToken } = useAppContext();
  const { idPost } = useParams();
  const [getIdTutor, setIdTutor] = useState("");
  const [tagPost] = useState(Img3);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [tutor_id, setTutor_id] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const sortRating = ["Giảm dần", "Tăng dần"];
  const [valueSortRating, setValueSortRating] = useState("Giảm dần");
  const [isClickSortRating, setIsClickSortRating] = useState(false);

  const [status, setStatus] = useState("");

  const handleClickSortRating = () => {
    setIsClickSortRating(!isClickSortRating);
  };

  const handleValueSortRating = (sort) => {
    setValueSortRating(sort);
    setIsClickSortRating(false);

    const sorted = [...sortedRegistrations].sort((a, b) =>
      sort === "Giảm dần"
        ? b.average_rating - a.average_rating
        : a.average_rating - b.average_rating
    );
    setSortedRegistrations(sorted);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/api/posts/${idPost}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("Fetched data:", data);

        if (response.ok) {
          const sortedData = data.registration.sort(
            (a, b) => b.average_rating - a.average_rating
          );
          console.log("Lấy thành công");
          setStatus("success");
          setSortedRegistrations(sortedData);
          setDataPost(data);
        } else {
          console.error("Lấy thất bại!");
          setStatus("error");
        }
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
      }
    };
    fetchData();
  }, [idPost, sessionToken]);

  const confirmSubmission = async () => {
    try {
      const url = `${import.meta.env.VITE_API_ENDPOINT}/api/class/appoint/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: idPost,
          tutor_id: getIdTutor,
        }),
      });

      if (response.ok) {
        toast.success("Nhận gia sư thành công", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/parent/assigned");
      } else {
        toast.error("Thao tác thất bại", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuoiHocClick = (post) => {
    setSelectedTime(post);
  };

  const handleTutorFeedbackClick = (tutor_id) => {
    setTutor_id(tutor_id);
    setShowFeedback(true);
  };

  const handleClosePopup = () => {
    setSelectedTime(null);
  };

  const handleTutorProfileClick = (tutor_id) => {
    setTutor_id(tutor_id);
    setShowProfile(true);
  };

  const formatDate = (isoDate) => {
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
    <Parent>
      {status === "success" && (
        <Panel role="parent" activeItem={3}>
          <p className="font-semibold text-[1.2rem] text-shadow-sm mb-4">
            Danh sách gia sư đăng kí
          </p>
          <div className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white py-4 flex flex-col">
            <div>
              <div className="flex justify-between px-4">
                <div className="flex gap-5 ">
                  <img
                    className="w-[50px] h-[50px] rounded-full object-cover"
                    // src="https://th.bing.com/th/id/OIP.0xm7fJtBKdm3hIVhXfmpQQHaJ4?&w=160&h=240&c=7&dpr=1.3&pid=ImgDet"
                    src={`${import.meta.env.VITE_API_ENDPOINT}${
                      dataPost.avatar
                    }`}
                    alt="avatar"
                  />
                  <div>
                    <strong>{dataPost.parent_name || dataPost.username}</strong>
                    <p className="opacity-60">
                      {formatDate(dataPost.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <img
                    className="w-[22px] h-[22px] mr-1"
                    src={tagPost}
                    alt=""
                  />
                  <p className="font-semibold">Đã phê duyệt</p>
                </div>
              </div>

              <div className="mt-3">
                <ul className=" px-4 grid grid-cols-2 gap-3">
                  <li className="flex gap-2">
                    <strong className="text-shadow-md italic ">Môn học:</strong>
                    <p>{dataPost.subject}</p>
                  </li>
                  <li className="flex gap-2">
                    <strong className="text-shadow-md italic ">Học phí:</strong>
                    <p>
                      {dataPost.wage_per_session?.toLocaleString("vi-VN")}
                      &nbsp;VNĐ
                    </p>
                  </li>
                  <li className="flex gap-2">
                    <strong className="text-shadow-md italic ">Lớp:</strong>
                    <p>{dataPost.grade}</p>
                  </li>
                  <li className="flex gap-2">
                    <strong className="text-shadow-md italic ">Địa chỉ:</strong>
                    <p>{dataPost.address}</p>
                  </li>
                  <li className="flex gap-2">
                    <strong className="text-shadow-md italic ">
                      Trình độ:
                    </strong>
                    <p>{dataPost.background_desired}</p>
                  </li>
                  <li className="flex items-center">
                    <strong className="text-shadow-md italic ">
                      Buổi học:
                    </strong>
                    <button
                      className="bg-[#F1BB45] text-black font-semibold font-poppins py-1 px-3.5 ml-4 rounded-lg shadow hover:bg-yellow-400 transition duration-300"
                      onClick={() => handleBuoiHocClick(dataPost)}
                    >
                      Chi tiết
                    </button>
                  </li>
                  <li className="flex gap-2">
                    <strong className="text-shadow-md italic ">
                      Số học viên:
                    </strong>
                    <p>{dataPost.student_number}</p>
                  </li>
                </ul>
              </div>
              <div className="px-4 pr-8 flex mt-4">
                <strong className="text-shadow-md italic text-nowrap mr-3">
                  Ghi chú:
                </strong>
                <p className=" line-clamp-3 hover:line-clamp-none">
                  {dataPost.description}
                </p>
              </div>
              {selectedTime && (
                <ClassTimeDetail
                  classTimes={selectedTime.class_times}
                  onClose={handleClosePopup}
                />
              )}
            </div>
            <div className="px-4 mt-3 flex flex-col self-center mb-3 w-[70%]">
              <div className="flex justify-between">
                <p className="text-[1.2rem] font-bold text-custom_darkblue ">
                  Danh sách gia sư đăng kí:{" "}
                </p>
                <div className="relative flex items-center p-2 bg-white">
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
              </div>

              <div className="mt-1 max-h-[15rem] px-3 overflow-auto py-4 rounded-xl scrollbar scrollbar-thumb-white/85 shadow-md bg-slate-100 border border-slate-200 ">
                {sortedRegistrations.map((tutor, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-5 py-1 cursor-pointer mb-1 hover:bg-slate-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          tutor.avatar !== "No avatar"
                            ? `${import.meta.env.VITE_API_ENDPOINT}${
                                tutor.avatar
                              }`
                            : UserImage
                        }
                        alt=""
                        className="w-[50px] h-[50px] rounded-full object-cover"
                      />
                      <div>
                        <p
                          className="font-semibold text-[1.1rem] hover:underline"
                          onClick={() =>
                            handleTutorProfileClick(tutor.tutor_id)
                          }
                        >
                          {tutor.tutor_name || tutor.username}
                        </p>
                        <p className="flex items-center gap-2">
                          {tutor.average_rating.toFixed(1)}{" "}
                          <FaStar className="w-5 h-5 text-yellow-400 " />
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <button
                        className="font-semibold text-[0.9rem] h-[2rem] w-[8rem] bg-custom_yellow rounded-md"
                        onClick={() => handleTutorFeedbackClick(tutor.tutor_id)}
                      >
                        Xem đánh giá
                      </button>
                      <button
                        className="font-semibold text-[0.9rem] h-[2rem] w-[8rem] bg-custom_darkblue text-white rounded-md"
                        onClick={() => {
                          setShowPopup(true);
                          setIdTutor(tutor.tutor_id);
                        }}
                      >
                        Nhận gia sư
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showProfile && (
              <TutorProfile
                tutor_id={tutor_id}
                onClose={() => {
                  setTutor_id(null);
                  setShowProfile(false);
                }}
              />
            )}
            {showFeedback && (
              <ReviewTutor
                tutor_id={tutor_id}
                onClose={() => {
                  setTutor_id(null);
                  setShowFeedback(false);
                }}
              />
            )}
            {showPopup && (
              <Popup
                open={showPopup}
                closeOnDocumentClick={false}
                onClose={() => setShowPopup(false)}
                position="right center"
                contentStyle={{
                  width: "400px",
                  borderRadius: "10px",
                  padding: "1%",
                }}
              >
                <div>
                  <div className="">
                    <p className="font-bold text-[1.1rem]">Xác nhận</p>
                  </div>
                  <hr className="my-2" />
                  <p>Bạn đồng ý nhận gia sư này?</p>

                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-red-500 text-white py-1 rounded w-[90px]"
                      onClick={() => setShowPopup(false)}
                    >
                      <i className="fa-solid fa-ban mr-2"></i>
                      Đóng
                    </button>
                    <button
                      className="bg-custom_darkblue text-white py-1 rounded w-[90px] ml-2"
                      onClick={() => confirmSubmission()}
                    >
                      <i className="fa-solid fa-check mr-2"></i>
                      OK
                    </button>
                  </div>
                </div>
              </Popup>
            )}
          </div>
        </Panel>
      )}
      {status === "error" && (
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-2xl">
            Bài đăng hiện không tồn tại hoặc đã bị xóa !
          </p>
        </div>
      )}
    </Parent>
  );
};

export default DetailPost;
