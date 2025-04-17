import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Img1 from "../../assets/image/quiz.png";
import Img2 from "../../assets/image/assignment.png";
import Img3 from "../../assets/image/medal.png";
import User from '../../assets/image/User.png';
import ClassTimeDetail from "../../layouts/popup/classTime_Popup";
import { useAppContext } from "../../AppProvider";
import ReportContent from "../popup/reportContent";
import { FaRegComment } from "react-icons/fa";
import CommentPost from "../popup/commentPost";

const ItemPostVu = ({ user, children, tag, comment_id, comment }) => {
  const [tagIcon, setTagIcon] = useState(null);
  const [selectedTime, setSelectedTime] = useState();
  const [totalLike, setTotalLike] = useState(user.total_reacts)
  const [showReport, setShowReport] = useState(false);
  const [showReportContent, setShowReportContent] = useState(false);
  const [showOpenCmt, setShowOpenCmt] = useState(false)
  const [isLike, setIsLike] = useState('fa-regular fa-thumbs-up')

  useEffect(() => {
    if (user?.is_reacted) {
      setIsLike('fa-solid fa-thumbs-up')
    } else {
      setIsLike('fa-regular fa-thumbs-up')
    }
  }, [])

  const { role, id, sessionToken } = useAppContext();

  const toggleReport = () => {
    setShowReport(!showReport);
    setShowReportContent(false);
  };

  const openReportContent = () => {
    setShowReport(false);
    setShowReportContent(true);
  };
  const handleBuoiHocClick = (post) => {
    setSelectedTime(post);
  };
  const handleCloseReportContent = () => {
    setShowReportContent(false);
  };

  useEffect(() => {
    if (tag === "Đã giao") setTagIcon(Img2);
    else if (tag === "Đã phê duyệt" || tag === "Đã đóng") setTagIcon(Img3);
    else if (tag === "Đang chờ phê duyệt" || tag === "Chờ duyệt") setTagIcon(Img1);
  }, [tag]);

  const handleLike = async (idPost) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/postlike/${idPost}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.ok) {
        if (response.status === 201) {
          setIsLike('fa-solid fa-thumbs-up');
          setTotalLike((prevTotal) => prevTotal + 1);
        } else if (response.status === 204) {
          setIsLike('fa-regular fa-thumbs-up');
          setTotalLike((prevTotal) => Math.max(0, prevTotal - 1));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  return (
    <div>
      <div className="flex justify-between p-4 group">
        <div className="flex items-center gap-7">
          <div className="flex gap-5">
            <img
              className="w-[50px] h-[50px] rounded-full object-cover"
              src={
                user.avatar
                  ? `${import.meta.env.VITE_API_ENDPOINT}${user.avatar}`
                  : User
              }
              alt="avatar"
            />
            <div>
              <strong>{user.parent_name || user.username}</strong>
              {role === "admin" && tag === "Đã phê duyệt" ? (
                <p className="opacity-60">
                  {formatDate(user.created_at)}. Được duyệt lúc{" "}
                  {formatDate(user.last_updated)}
                </p>
              ) : (
                <p className="opacity-60">{formatDate(user.created_at)}</p>
              )}
            </div>
          </div>
          {id !== user.parent_id && role !== "admin" && tag !== "Đã đóng" && (
            <div>
              <i
                className={`fa-solid fa-ellipsis text-2xl cursor-pointer hover:text-black transition-all ${showReport || showReportContent
                  ? "text-black"
                  : "text-slate-100"
                  }`}
                onClick={toggleReport}
              ></i>

              {showReport && (
                <div className="bg-slate-100 absolute p-1 rounded-md cursor-pointer shadow-md">
                  <div
                    className="flex gap-1 items-center p-1 hover:bg-slate-200 rounded-md"
                    onClick={openReportContent}
                  >
                    <i className="fa-solid fa-flag"></i>
                    <span>Report</span>
                  </div>
                </div>
              )}

              {showReportContent && (
                <div>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={handleCloseReportContent}
                  ></div>
                  <div className="fixed inset-0 flex items-center justify-center z-40">
                    <ReportContent
                      onClose={handleCloseReportContent}
                      reportedPartyId={user.parent_id}
                      postId={user.post_id}
                      type="Bài đăng"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex">
          <img className="w-[22px] h-[22px] mr-1" src={tagIcon} alt="" />
          <p className="font-semibold">{tag}</p>
        </div>
      </div>

      <div className="">
        <ul className="px-4 grid grid-cols-2 gap-3">
          <li className="flex gap-2">
            <strong className="text-shadow-md italic">Môn học:</strong>
            <p>{user.subject}</p>
          </li>
          <li className="flex gap-2">
            <strong className="text-shadow-md italic">Học phí:</strong>
            <p>{user.wage_per_session.toLocaleString("vi-VN")}&nbsp;VNĐ</p>
          </li>
          <li className="flex gap-2">
            <strong className="text-shadow-md italic">Lớp:</strong>
            <p>{user.grade}</p>
          </li>
          <li className="flex gap-2">
            <strong className="text-shadow-md italic">Địa chỉ:</strong>
            <p>{user.address}</p>
          </li>
          <li className="flex gap-2">
            <strong className="text-shadow-md italic">Trình độ:</strong>
            <p>{user.background_desired}</p>
          </li>
          <li className="flex items-center">
            <strong className="text-shadow-md italic">Buổi học:</strong>
            <button
              className="bg-[#F1BB45] text-black font-semibold font-poppins py-1 px-3.5 ml-4 rounded-lg shadow hover:bg-yellow-400 transition duration-300"
              onClick={() => handleBuoiHocClick(user)}
            >
              Chi tiết
            </button>
          </li>
          <li className="flex gap-2">
            <strong className="text-shadow-md italic">Số học viên:</strong>
            <p>{user.student_number}</p>
          </li>
        </ul>
        <div className="px-4 pr-8 flex mt-4">
          <strong className="text-shadow-md italic text-nowrap mr-3">
            Ghi chú:
          </strong>
          <p className="line-clamp-3 hover:line-clamp-none">
            {user.description}
          </p>
        </div>
        <div className="relative h-20 bg-[#002182] mt-5 rounded-b-[0.8rem] flex justify-center items-center">
          {children}
          {(tag === undefined ||
            tag === "Đã phê duyệt") && (
              <div className="absolute flex gap-3 -bottom-[30%] left-5">
                <div
                  className="flex items-center gap-2 bg-white p-3 rounded-full cursor-pointer group border border-slate-500"
                  onClick={() => handleLike(user.post_id)}
                >
                  <i
                    className={`${isLike} text-[1.1rem] group-hover:scale-110`}
                  ></i>
                  <p>{totalLike}</p>
                </div>
                <div
                  className="bg-white p-3 rounded-full cursor-pointer group border border-slate-500"
                  onClick={() => {
                    setShowOpenCmt(true);
                  }}
                >
                  <FaRegComment className="w-5 h-5 group-hover:scale-110" />
                </div>
              </div>
            )}
        </div>
      </div>

      {showOpenCmt && (
        <CommentPost
          idPost={user.post_id}
          comment_id={comment_id}
          comment={comment}
          onClose={() => setShowOpenCmt(false)}
          onOpen={() => setShowOpenCmt(true)}
        />
      )}

      {selectedTime && (
        <ClassTimeDetail
          classTimes={selectedTime.class_times}
          onClose={() => setSelectedTime(null)}
        />
      )}
    </div>
  );
};

ItemPostVu.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
  tag: PropTypes.string,
  comment_id: PropTypes.string,
  comment: PropTypes.array,
};

export default ItemPostVu;
