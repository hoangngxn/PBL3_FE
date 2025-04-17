import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Page from "../../layouts/panel/Panel";
import ItemPost from "../../layouts/itemPost/ItemPost";
import Pagination from "../../layouts/pagination/pagination";
import Admin from "../../layouts/PageAuthorization/admin/admin";
import { useAppContext } from "../../AppProvider";
import { useParams, useLocation } from "react-router-dom";

const ApprovedPost = () => {
  const [postList, setPostList] = useState([]);
  const location = useLocation();
  const { comment_id, comments } = location.state || {};
  console.log("Received comment:", comments); // Ghi log giá trị của comment
  const [showPopupCmt, setShowPopupCmt] = useState(false);
  const [popupComments, setPopupComments] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const [commentsFetched, setCommentsFetched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { sessionToken } = useAppContext();
  const itemsPerPage = 10;
  const { postId } = useParams();

  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_ENDPOINT
          }/api/admin/posts/?status=approved`,
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
            setPostList(data.results.filter((post) => post.post_id === postId));
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

    fetchApprovedPosts();
  }, []);

  const totalPages = Math.ceil(postList.length / itemsPerPage);

  const currentPosts = postList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  const handleViewCmt = () => {
    setShowPopupCmt(true);
    if (!commentsFetched) {
      fetchComments();
    }
  };

  const fetchComments = async () => {
    try {
      const fetchedComments = await Promise.all(
        comments.map(async (id) => {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_ENDPOINT
            }/api/admin/report-comment/${id}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${sessionToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error(
              `Error fetching comment ${id}: ${response.statusText}`
            );
          }
          const data = await response.json();
          console.log("Fetched comment data:", data);
          return data;
        })
      );
      setPopupComments(fetchedComments);
      setCommentsFetched(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Admin del cmt

  const handleDeleteComment = async (comment_id) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/api/admin/report-comment/${comment_id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setShowConfirmDelete(false);
        alert("Xóa bình luận thành công");
        window.location.reload();
      } else {
        console.error("Failed to delete comment");
        alert("Xóa bình luận không thành công");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleConfirmDelete = (comment_id) => {
    setCommentToDelete(comment_id);
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setCommentToDelete(null);
    setShowConfirmDelete(false);
  };

  return (
    <Admin>
      <Page activeItem={4}>
        <div className="relative max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((post, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white mb-6"
            >
              <ItemPost
                user={post}
                tag="Đã phê duyệt"
                comment_id={comment_id}
                comments={comments}
              >
                <button
                  className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8"
                  onClick={handleDeleteClick(post.post_id)}
                >
                  Xóa bài đăng
                </button>
                {postId && (
                  <button
                    className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8"
                    onClick={() => {
                      window.history.back();
                    }}
                  >
                    Xem lại báo cáo
                  </button>
                )}
                {comment_id && (
                  <button
                    className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8"
                    onClick={handleViewCmt}
                  >
                    Xem bình luận bị báo cáo
                  </button>
                )}
              </ItemPost>
            </div>
          ))}
        </div>
        {!postId && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {postList.length === 0 && (
          <div>
            <div className="text-center mt-4 text-lg font-semibold">
              Không tồn tại bài đăng nào hoặc bài đăng đã đóng
            </div>
            <div className="text-center mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-500"
                onClick={() => {
                  window.history.back();
                }}
              >
                Quay lại
              </button>
            </div>
          </div>
        )}

        {showPopupCmt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-8 relative">
              {/* Nút đóng */}
              <button
                onClick={() => setShowPopupCmt(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              {/* Tiêu đề */}
              <h2 className="text-2xl font-bold text-center text-gray-800 border-b pb-4">
                Bình luận bị báo cáo
              </h2>

              {/* Nội dung */}
              <div className="mt-6">
                {popupComments.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    Không có bình luận nào được báo cáo.
                  </p>
                ) : (
                  <div>
                    {/* Trường hợp chỉ có 1 bình luận */}
                    {popupComments.length === 1 && (
                      <div className="flex items-start p-5 rounded-lg shadow-md bg-yellow-100">
                        {/* Avatar người dùng */}
                        <img
                          src={
                            `${import.meta.env.VITE_API_ENDPOINT}${
                              popupComments[0].user.avatar
                            }` || "/default-avatar.png"
                          }
                          alt="Avatar"
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            <strong>Người dùng:</strong>{" "}
                            <span className="font-semibold">
                              {popupComments[0].user.profilename}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            <strong>Thời gian:</strong>{" "}
                            {new Date(
                              popupComments[0].created_at
                            ).toLocaleString()}
                          </p>
                          <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow">
                            <p className="text-gray-800 font-medium">
                              {popupComments[0].comment ===
                              "Bình luận này đã bị xóa do vi phạm tiêu chuẩn cộng đồng" ? (
                                <span className="italic text-gray-400">
                                  {popupComments[0].comment}
                                </span>
                              ) : (
                                popupComments[0].comment
                              )}
                            </p>
                          </div>
                          <span className="text-xs italic text-red-500 block mt-1">
                            Bình luận bị báo cáo
                          </span>
                          {/* Ẩn nút xóa nếu bình luận đã bị xóa */}
                          {popupComments[0].comment !==
                            "Bình luận này đã bị xóa do vi phạm tiêu chuẩn cộng đồng" && (
                            <button
                              onClick={() =>
                                handleConfirmDelete(popupComments[0].comment_id)
                              }
                              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                            >
                              Xóa bình luận
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Trường hợp có 2 bình luận */}
                    {popupComments.length === 2 && (
                      <div className="space-y-6">
                        {/* Bình luận gốc */}
                        <div
                          key={popupComments[0].comment_id}
                          className="flex items-start p-5 rounded-lg shadow-md bg-gray-50 relative"
                        >
                          <img
                            src={
                              `${import.meta.env.VITE_API_ENDPOINT}${
                                popupComments[0].user.avatar
                              }` || "/default-avatar.png"
                            }
                            alt="Avatar"
                            className="w-12 h-12 rounded-full mr-4 object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">
                              <strong>Người dùng:</strong>{" "}
                              <span className="font-semibold">
                                {popupComments[0].user.profilename}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              <strong>Thời gian:</strong>{" "}
                              {new Date(
                                popupComments[0].created_at
                              ).toLocaleString()}
                            </p>
                            <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow">
                              <p className="text-gray-800 font-medium">
                                {popupComments[0].comment ===
                                "Bình luận này đã bị xóa do vi phạm tiêu chuẩn cộng đồng" ? (
                                  <span className="italic text-gray-400">
                                    {popupComments[0].comment}
                                  </span>
                                ) : (
                                  popupComments[0].comment
                                )}
                              </p>
                            </div>
                            <span className="text-xs italic text-gray-500 block mt-1">
                              Bình luận gốc
                            </span>
                          </div>
                        </div>

                        {/* Bình luận bị báo cáo */}
                        <div
                          key={popupComments[1].comment_id}
                          className="flex items-start p-5 rounded-lg shadow-md bg-yellow-100"
                        >
                          <img
                            src={
                              `${import.meta.env.VITE_API_ENDPOINT}${
                                popupComments[1].user.avatar
                              }` || "/default-avatar.png"
                            }
                            alt="Avatar"
                            className="w-12 h-12 rounded-full mr-4 object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">
                              <strong>Người dùng:</strong>{" "}
                              <span className="font-semibold">
                                {popupComments[1].user.profilename}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              <strong>Thời gian:</strong>{" "}
                              {new Date(
                                popupComments[1].created_at
                              ).toLocaleString()}
                            </p>
                            <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow">
                              <p className="text-gray-800 font-medium">
                                {popupComments[1].comment ===
                                "Bình luận này đã bị xóa do vi phạm tiêu chuẩn cộng đồng" ? (
                                  <span className="italic text-gray-400">
                                    {popupComments[1].comment}
                                  </span>
                                ) : (
                                  popupComments[1].comment
                                )}
                              </p>
                            </div>
                            <span className="text-xs italic text-red-500 block mt-1">
                              Bình luận bị báo cáo
                            </span>
                            {/* Ẩn nút xóa nếu bình luận đã bị xóa */}
                            {popupComments[1].comment !==
                              "Bình luận này đã bị xóa do vi phạm tiêu chuẩn cộng đồng" && (
                              <button
                                onClick={() =>
                                  handleConfirmDelete(
                                    popupComments[1].comment_id
                                  )
                                }
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                              >
                                Xóa bình luận
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirm */}
        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
              <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
                Xác nhận xóa bình luận
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa bình luận này không?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleDeleteComment(commentToDelete)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Xóa
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </Page>
    </Admin>
  );
};

ApprovedPost.propTypes = {
  postID: PropTypes.string,
};

export default ApprovedPost;
