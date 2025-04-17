import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useAppContext } from "../../AppProvider";
import Page from "../../layouts/panel/Panel";
import Parent from "../../layouts/PageAuthorization/parent/parent";
import ItemPost from "../../layouts/itemPost/ItemPost";
import Pagination from "../../layouts/pagination/pagination";
import TutorProfileToReview from "../../layouts/popup/TutorProfileToReview";

const SuatDayDaGiao = () => {
  const { sessionToken, id } = useAppContext();
  const [tutor_id, setTutor_id] = useState(null);
  const [posts, setPost] = useState([]);
  const [postId, setPostId] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  //   const [dataPop, setDataPop] = useState({
  //     position: "bottom-right",
  //     autoClose: 5000,
  //     hideProgressBar: true,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  // });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/api/posts/${id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          console.log("Lấy thành công");

          const filteredPosts = data.filter(
            (post) => post.status === "Đã đóng"
          );
          const sortedPosts = filteredPosts.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setPost(sortedPosts);
        } else {
          console.error("Lấy thất bại!");
        }
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
      }
    };
    fetchData();
  }, []);
  console.log("id tutor", tutor_id);
  return (
    <Parent>
      <Page role="parent" activeItem={5}>
        <p className="font-semibold text-[1.2rem] text-shadow-sm mb-4">
          Các suất dạy đã giao
        </p>
        <div className="relative max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((parent) => (
            <div
              key={parent.post_id} // Sử dụng post_id làm key
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white"
            >
              <ItemPost user={parent} tag="Đã đóng">
                <button
                  onClick={() => {
                    setShowRatingPopup(true);
                    setTutor_id(parent.class[0].tutor_id)
                    setPostId(parent.class[0].class_id)
                  }}
                  className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8"
                >
                  Đánh giá gia sư
                </button>
              </ItemPost>
            </div>
          ))}
        </div>
        {/* Pagination */}
        {posts.length > 0 ? (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="text-center font-bold">Không có bài đăng nào</div>
        )}
        {showRatingPopup && <TutorProfileToReview tutor_id={tutor_id} idPost={postId} idParent={id} onClose={() => { setShowRatingPopup(false); setTutor_id(null); setPostId(null) }} />}
      </Page>
    </Parent>
  );
};

SuatDayDaGiao.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SuatDayDaGiao;
