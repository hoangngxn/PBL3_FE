import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";


import Popup from "reactjs-popup";
import Page from "../../layouts/panel/Panel";

import ItemPost from "../../layouts/itemPost/ItemPost";
import Pagination from "../../layouts/pagination/pagination";
import { toast } from "react-toastify";
import Tutor from "../../layouts/PageAuthorization/tutor/tutor";
const SuatDayDaDangKy = () => {
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
          `${import.meta.env.VITE_API_ENDPOINT}/api/tutor/posts/?status=registered`,
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
          console.log("Token:", sessionToken);
          console.log("Data:", data);
          console.log("Data:", id);

          if (Array.isArray(data.results)) {
            const filteredPosts = data.results.filter(
              (post) => post.status === "Đã phê duyệt"
            );
            const sortedPosts = filteredPosts.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setPost(sortedPosts);
          } else {
            console.error("Data.results không phải là mảng:", data.results);
          }
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
        `${import.meta.env.VITE_API_ENDPOINT}/api/tutor/posts/${postId}/`,
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

        setTimeout(() => {
          window.location.reload();
          navigate("/tutor/registered");
        }, 2000);
        navigate("/tutor/registered");
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
    <Tutor>
      <Page role="tutor" activeItem={3}>
        <p className="font-semibold text-[1.2rem] text-shadow-sm mb-4">
          Các suất dạy đã đăng ký
        </p>
        <div className="relative max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((tutor, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white mb-6"
            >
              <ItemPost user={tutor} tag="Chờ duyệt">
                <button
                  onClick={() => {
                    setShowPopup(true);
                    setSelectedPostId(tutor.post_id);
                  }}
                  className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8"
                >
                  Hủy đăng ký
                </button>
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
            <p>Bạn chắc chắn muốn hủy đăng ký?</p>

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
    </Tutor>
  );
};

SuatDayDaDangKy.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SuatDayDaDangKy;
