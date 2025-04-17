import { useEffect, useState } from "react";
import { useAppContext } from "../../AppProvider";
import Page from "../../layouts/panel/Panel";
import ItemPost from "../../layouts/itemPost/ItemPost";
import Pagination from "../../layouts/pagination/pagination";
import Admin from "../../layouts/PageAuthorization/admin/admin";
import VerifyPost from "../../layouts/popup/Verify_Post";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const DuyetBaiDang = () => {
  const [postList, setPostList] = useState([]);
  const { sessionToken } = useAppContext();
  const [selectedPost, setSelectedPost] = useState(null); // Chọn bài đăng hiện tại để duyệt
  const { postId } = useParams();

  const handleApproveClick = (post) => {
    setSelectedPost(post);
  };

  const handleClosePopup = () => {
    setSelectedPost(null);
  };

  const handleApprovePost = async () => {
    if (!selectedPost) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/admin/posts/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: selectedPost.post_id,
            status: "Đã phê duyệt",
          }),
        }
      );

      if (response.ok) {
        console.log("Cập nhật trạng thái thành công!");
        setPostList((prevPosts) =>
          prevPosts.filter((post) => post.post_id !== selectedPost.post_id)
        );
        toast.success("Đăng bài thành công", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSelectedPost(null);
      } else {
        console.error("Lỗi khi cập nhật trạng thái!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_ENDPOINT
          }/api/admin/posts/?status=pending`,
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
          if (postId) {
            const post = data.results.find((post) => post.post_id === postId);
            setPostList([post]);
            return;
          } else {
            setPostList(data.results);
          }
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [postId, sessionToken]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(postList.length / itemsPerPage);

  const currentPosts = postList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //Delete
  const handleDeleteClick = (post_id) => async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/api/admin/posts/${post_id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          setPostList((prevPosts) =>
            prevPosts.filter((post) => post.post_id !== post_id)
          );
        } else {
          console.error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <Admin>
      <Page activeItem={5}>
        <div className="relative max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((post, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white"
            >
              {post ? (
                <ItemPost user={post} tag={post.status || "Chờ duyệt"}>
                  <button
                    className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8"
                    onClick={() => handleApproveClick(post)} // Mở popup xác nhận
                  >
                    Duyệt bài đăng
                  </button>
                  <button
                    className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8"
                    onClick={handleDeleteClick(post.post_id)}
                  >
                    Xóa bài đăng
                  </button>
                </ItemPost>
              ) : (
                <div className="flex justify-center items-center h-[80vh]">
                  <p className="text-2xl">
                    Bài đăng hiện không tồn tại hoặc đã bị xóa !
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {postList.length > 0 ? (
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

        {selectedPost && (
          <VerifyPost
            post={selectedPost}
            onApprove={handleApprovePost}
            onClose={handleClosePopup}
          />
        )}
      </Page>
    </Admin>
  );
};

export default DuyetBaiDang;
