import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAppContext } from "../../AppProvider";

import Pagination from "../../layouts/pagination/pagination";
import Panel_Search from "../../layouts/panel/Panel_Search";
import ItemPost from "../../layouts/itemPost/ItemPost";
import Tutor from "../../layouts/PageAuthorization/tutor/tutor";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";

const MainPageTutor = ({ searchTerm }) => {
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

  const [filters, setFilters] = useState({
    subject: null,
    fee: null,
    minStudents: 1,
    maxStudents: 20,
    grade: [],
    sessions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${import.meta.env.VITE_API_ENDPOINT}/api/posts/`;
        if (searchTerm && searchTerm.trim() !== "") {
          url = `${
            import.meta.env.VITE_API_ENDPOINT
          }/api/search/?text=${searchTerm}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data);
        console.log(id);
        if (response.ok) {
          let filteredPosts = data.filter(
            (post) => post.status === "Đã phê duyệt"
          );

          // Lọc môn học
          if (filters.subject && filters.subject !== "Môn học") {
            filteredPosts = filteredPosts.filter(
              (post) => post.subject === filters.subject
            );
          }

          // Lọc lớp
          if (filters.grade.length > 0) {
            console.log("filters.grade:", filters.grade);
            filteredPosts = filteredPosts.filter((post) => {
              console.log("post.grade:", post.grade);
              return filters.grade.includes(post.grade.toString());
            });
          }

          // Lọc học phí (Dưới 20.000đ, 20.000đ - 50.000đ, 50.000đ - 80.000đ, 80.000đ - 100.000đ, Trên 100.000đ)
          if (filters.fee) {
            if (filters.fee === "Dưới 20.000đ") {
              filteredPosts = filteredPosts.filter(
                (post) => post.wage_per_session < 20000
              );
            }
            if (filters.fee === "20.000đ - 50.000đ") {
              filteredPosts = filteredPosts.filter(
                (post) => post.fee >= 20000 && post.wage_per_session <= 50000
              );
            }
            if (filters.fee === "50.000đ - 80.000đ") {
              filteredPosts = filteredPosts.filter(
                (post) => post.fee >= 50000 && post.wage_per_session <= 80000
              );
            }
            if (filters.fee === "80.000đ - 100.000đ") {
              filteredPosts = filteredPosts.filter(
                (post) => post.fee >= 80000 && post.wage_per_session <= 100000
              );
            }
            if (filters.fee === "Trên 100.000đ") {
              filteredPosts = filteredPosts.filter(
                (post) => post.wage_per_session > 100000
              );
            }
          }

          // Lọc số học viên
          filteredPosts = filteredPosts.filter(
            (post) =>
              post.student_number >= filters.minStudents &&
              post.student_number <= filters.maxStudents
          );

          // Lọc buổi học
          if (filters.sessions.length > 0) {
            filteredPosts = filteredPosts.filter((post) => {
              return post.class_times.some((classTime) =>
                filters.sessions.includes(classTime.weekday)
              );
            });
          }

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
  }, [filters, searchTerm]);

  const confirmSubmission = async (postId) => {
    setShowPopup(false);

    const requestData = {
      post_id: postId,
      tutor_id: id,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/tutor/posts/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      console.log("Response data:", data);
      if (response.ok) {
        toast.success("Đăng ký suất dạy thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        navigate("/tutor/registered");
      } else {
        toast.error("Đăng ký thất bại!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký dạy:", error);
      toast.error("Có lỗi xảy ra!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Tutor>
      <Panel_Search
        setFilters={setFilters}
        className="flex flex-col max-h-full"
      >
        <div className="flex items-center mb-2 -mt-2">
          <svg
            width="70"
            height="70"
            viewBox="0 0 124 134"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="1" filter="url(#filter0_d_137_1453)">
              <g filter="url(#filter1_d_137_1453)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M47.5022 21.1185C46.9992 22.1244 46.7402 23.2026 46.7402 24.2915L53.5853 24.2915C53.5853 23.9472 53.6672 23.6063 53.8262 23.2883C53.9853 22.9702 54.2184 22.6812 54.5123 22.4378C54.8062 22.1943 55.1551 22.0012 55.5391 21.8695C55.9231 21.7377 56.3346 21.6699 56.7502 21.6699C57.1659 21.6699 57.5774 21.7377 57.9614 21.8695C58.3454 22.0012 58.6943 22.1943 58.9882 22.4378C59.2821 22.6812 59.5152 22.9702 59.6742 23.2883C59.833 23.6057 59.9149 23.946 59.9152 24.2896H59.9V43.7717H66.76V24.2915H66.7602C66.7602 23.2026 66.5013 22.1245 65.9983 21.1185C65.4952 20.1125 64.7579 19.1985 63.8284 18.4285C62.8989 17.6586 61.7954 17.0478 60.5809 16.6312C59.3664 16.2145 58.0648 16 56.7502 16C55.4357 16 54.134 16.2145 52.9196 16.6312C51.7051 17.0478 50.6016 17.6586 49.6721 18.4285C48.7426 19.1985 48.0053 20.1125 47.5022 21.1185Z"
                  fill="#F1BB45"
                />
              </g>
              <ellipse
                cx="62"
                cy="75.0854"
                rx="42"
                ry="34.7895"
                fill="#F1BB45"
              />
              <ellipse
                cx="54.6442"
                cy="76.9512"
                rx="4.86441"
                ry="4.02929"
                fill="#D9D9D9"
              />
              <ellipse
                cx="90.1188"
                cy="76.9512"
                rx="4.86441"
                ry="4.02929"
                fill="#D9D9D9"
              />
              <path
                d="M81.2206 80.9795C81.2206 82.7258 80.3831 84.4006 78.8923 85.6354C77.4016 86.8702 75.3797 87.5639 73.2714 87.5639C71.1632 87.5639 69.1413 86.8702 67.6505 85.6354C66.1598 84.4006 65.3223 82.7258 65.3223 80.9795L73.2714 80.9795H81.2206Z"
                fill="#D9D9D9"
              />
              <g filter="url(#filter2_f_137_1453)">
                <ellipse
                  cx="54.6442"
                  cy="76.9512"
                  rx="4.86441"
                  ry="4.02929"
                  fill="#D9D9D9"
                />
              </g>
              <g filter="url(#filter3_f_137_1453)">
                <ellipse
                  cx="90.1188"
                  cy="76.9512"
                  rx="4.86441"
                  ry="4.02929"
                  fill="#D9D9D9"
                />
              </g>
              <g filter="url(#filter4_i_137_1453)">
                <path
                  d="M81.2206 80.9795C81.2206 82.7258 80.3831 84.4006 78.8923 85.6354C77.4016 86.8702 75.3797 87.5639 73.2714 87.5639C71.1632 87.5639 69.1413 86.8702 67.6505 85.6354C66.1598 84.4006 65.3223 82.7258 65.3223 80.9795L73.2714 80.9795H81.2206Z"
                  fill="white"
                  fillOpacity="0.89"
                />
              </g>
              <g filter="url(#filter5_d_137_1453)">
                <ellipse
                  cx="48.42"
                  cy="29.8847"
                  rx="8.505"
                  ry="7.04487"
                  fill="#F1BB45"
                />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_d_137_1453"
                x="0"
                y="0"
                width="124"
                height="133.875"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_137_1453"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_137_1453"
                  result="shape"
                />
              </filter>
              <filter
                id="filter1_d_137_1453"
                x="42.7402"
                y="16"
                width="28.02"
                height="35.7715"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_137_1453"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_137_1453"
                  result="shape"
                />
              </filter>
              <filter
                id="filter2_f_137_1453"
                x="45.7798"
                y="68.9219"
                width="17.729"
                height="16.0586"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="2"
                  result="effect1_foregroundBlur_137_1453"
                />
              </filter>
              <filter
                id="filter3_f_137_1453"
                x="81.2544"
                y="68.9219"
                width="17.729"
                height="16.0586"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="2"
                  result="effect1_foregroundBlur_137_1453"
                />
              </filter>
              <filter
                id="filter4_i_137_1453"
                x="65.3223"
                y="80.9795"
                width="15.8984"
                height="10.5845"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_137_1453"
                />
              </filter>
              <filter
                id="filter5_d_137_1453"
                x="35.915"
                y="22.8398"
                width="25.0098"
                height="22.0898"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_137_1453"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_137_1453"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
          <p className="font-semibold text-[1.2rem] text-shadow-sm">
            {searchTerm
              ? `Kết quả tìm kiếm "${searchTerm}": `
              : "BÀI ĐĂNG GẦN ĐÂY"}
          </p>
        </div>
        <div className="relative max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((tutor, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white mb-6"
            >
              <ItemPost user={tutor}>
                <button
                  onClick={() => {
                    setShowPopup(true);
                    setSelectedPostId(tutor.post_id);
                  }}
                  className="bg-yellow-500 w-[14vw] p-2 rounded-2xl font-semibold mx-8"
                >
                  Đăng kí dạy
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
      </Panel_Search>

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
            <p>Bạn chắc chắn muốn đăng ký</p>

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

MainPageTutor.propTypes = {
  searchTerm: PropTypes.string,
};

export default MainPageTutor;
