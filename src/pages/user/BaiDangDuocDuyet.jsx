import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Popup from "reactjs-popup";
import Page from "../../layouts/panel/Panel";
import Parent from "../../layouts/PageAuthorization/parent/parent";
import ItemPost from "../../layouts/itemPost/ItemPost";
import Pagination from "../../layouts/pagination/pagination";
import { toast } from "react-toastify";
const BaiDangDuocDuyet = () => {
  let navigate = useNavigate();
  const { sessionToken, id } = useAppContext();
  const [posts, setPost] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const currentPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            (post) => post.status === "Đã phê duyệt"
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

  const confirmSubmission = async (postId) => {
    setShowPopup(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/posts/${postId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Xóa bài đăng thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        window.location.reload();
        navigate("/parent/pending-posts");
      } else {
        toast.error("Xóa bài đăng thất bại!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài đăng:", error);
      toast.error("Có lỗi xảy ra!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Parent>
      <Page role="parent" activeItem={3}>
        <p className="font-semibold text-[1.2rem] text-shadow-sm mb-4">
          Các bài đăng đã được phê duyệt
        </p>
        <div className="relative max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((parent, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white mb-6"
            >
              <ItemPost user={parent} tag="Đã phê duyệt">
                <Link to={`/parent/update-post/${parent.post_id}`}>
                  <button className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8">
                    Sửa bài đăng
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setShowPopup(true);
                    setSelectedPostId(parent.post_id);
                  }}
                  className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8"
                >
                  Xóa bài đăng
                </button>
                <Link
                  to={`/parent/detailPost/${parent.post_id}`}
                  onClick={() => { }}
                  className="bg-yellow-500 w-[14vw] p-2 text-center rounded-2xl font-semibold mx-8"
                >
                  Danh sách gia sư đăng kí
                </Link>
              </ItemPost>
            </div>
          ))}
        </div>
        {/* Pagination */}
        {posts.length > 0 ? (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="text-center font-bold">Không có bài đăng nào</div>
        )}
      </Page>
      {showPopup && (
        <Popup
          open={showPopup}
          closeOnDocumentClick={false}
          onClose={() => setShowPopup(false)}
          position="right center"
          contentStyle={{ width: "400px", borderRadius: "10px", padding: "1%" }}
        >
          <div>
            <div>
              <p className="font-bold text-[1.1rem]">Xác nhận</p>
            </div>
            <hr className="my-2" />
            <p>Bạn chắc chắn muốn xóa bài đăng này?</p>

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
                onClick={() => confirmSubmission(selectedPostId)}
              >
                <i className="fa-solid fa-check mr-2"></i>
                OK
              </button>
            </div>
          </div>
        </Popup>
      )}
    </Parent>
  );
};

BaiDangDuocDuyet.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BaiDangDuocDuyet;
