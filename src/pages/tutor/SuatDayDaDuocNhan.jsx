import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useAppContext } from "../../AppProvider";

import Page from "../../layouts/panel/Panel";

import ItemPost from "../../layouts/itemPost/ItemPost";
import Pagination from "../../layouts/pagination/pagination";
import Tutor from "../../layouts/PageAuthorization/tutor/tutor";

const SuatDayDaDuocNhan = () => {
  const { sessionToken } = useAppContext();
  const [posts, setPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(posts.length / itemsPerPage);

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
          `${import.meta.env.VITE_API_ENDPOINT
          }/api/tutor/class/?status=appointed`,
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
          console.log("Dữ liệu trả về:", data);

          if (Array.isArray(data)) {
            const filteredPosts = data.filter(
              (post) => post.status === "Đã đóng"
            );
            const sortedPosts = filteredPosts.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setPost(sortedPosts);
          } else {
            console.error("Dữ liệu không phải là mảng");
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

  return (
    <Tutor>
      <Page role="tutor" activeItem={4}>
        <p className="font-semibold text-[1.2rem] text-shadow-sm mb-4">
          Các suất dạy đã được nhận
        </p>
        <div className="relative max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((tutor, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white"
            >
              <ItemPost user={tutor} tag="Đã đóng"></ItemPost>
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
      </Page>
    </Tutor>
  );
};

SuatDayDaDuocNhan.propTypes = {
  post: PropTypes.object,
};

export default SuatDayDaDuocNhan;
