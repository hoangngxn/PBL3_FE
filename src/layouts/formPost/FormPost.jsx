import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequiredIndicator = () => {
  return <span className="text-red-500">*</span>;
};

const FormPost = ({ func, postId }) => {
  let navigate = useNavigate();
  const [subject, setSubject] = useState("Toán");
  const [selectedClasses, setSelectedClasses] = useState(1);
  const [level, setLevel] = useState("Có bằng tốt nghiệp trung học phổ thông");
  const [studentNumber, setStudentNumber] = useState(0);
  const [feesView, setFeesView] = useState("");
  const [fees, setFees] = useState("");
  const [location, setLocation] = useState("");
  const [days, setDays] = useState("");
  const [classTimes, setClassTimes] = useState([]);
  const [note, setNote] = useState("");

  const { id, dataEnum, sessionToken } = useAppContext();

  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  useEffect(() => {
    if (postId) {
      const fetchPostData = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_ENDPOINT}/api/posts/${postId}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${sessionToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          console.log("Dữ liệu bài đăng:", data);
          if (response.ok) {
            setSubject(data.subject || "");
            setSelectedClasses(data.grade || 1);
            setLevel(data.background_desired || "");
            setStudentNumber(data.student_number || 0);
            setFees(data.wage_per_session || 0);
            setLocation(data.address || "");
            setDays(data.session_per_week || "");
            setClassTimes(data.class_times || []);
            setNote(data.description || "");
            setFeesView(
              `${parseInt(data.wage_per_session || 0).toLocaleString(
                "vi-VN"
              )} VNĐ`
            );
          } else {
            console.error("Không lấy được dữ liệu bài đăng");
          }
        } catch (error) {
          console.error("Lỗi khi fetch bài đăng:", error);
        }
      };

      fetchPostData();
    }
  }, [postId, sessionToken]);
  console.log(classTimes);

  const confirmSubmission = async () => {
    setShowPopup(false);

    const formData = {
      id,
      subject,
      selectedClasses,
      level,
      studentNumber,
      fees,
      location,
      days,
      classTimes,
      note,
    };
    console.log(formData);

    try {
      const method = postId ? "PUT" : "POST";
      const url = postId
        ? `${import.meta.env.VITE_API_ENDPOINT}/api/posts/${postId}/`
        : `${import.meta.env.VITE_API_ENDPOINT}/api/posts/`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_id: formData.id,
          subject: formData.subject,
          address: formData.location,
          grade: formData.selectedClasses,
          background_desired: formData.level,
          session_per_week: formData.days,
          wage_per_session: formData.fees,
          student_number: formData.studentNumber,
          class_times: formData.classTimes.map((time) => ({
            weekday: time.weekday,
            time_start: time.time_start,
            time_end: time.time_end,
          })),
          description: formData.note,
          duration: 2,
        }),
      });

      if (response.ok) {
        const successMes = postId
          ? "Sửa bài đăng thành công"
          : "Đăng bài đăng thành công";
        toast.success(successMes, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/parent/pending-posts");
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

  const handleChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    setFees(value);
    setFeesView(value ? parseInt(value).toLocaleString("vi-VN") + " VNĐ" : "");
  };

  return (
    <div>
      <div className="flex items-center">
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
            <ellipse cx="62" cy="75.0854" rx="42" ry="34.7895" fill="#F1BB45" />
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
        <p className="font-semibold text-[1.2rem] text-shadow-sm">{func}</p>
      </div>
      <div>
        <form className="flex flex-col ml-[20vw]" onSubmit={handleSubmit}>
          {/* Môn học */}
          <div className="form__row flex mb-5 items-center">
            <label
              className="form__label min-w-[125px] font-semibold"
              htmlFor="subject"
            >
              Môn học
              <RequiredIndicator />
            </label>
            <select
              className="w-[20vw] shadow-md border-2 border-custom_gray bg-gray-200 rounded-md py-1 px-2 text-[0.9rem] focus:outline-none"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {dataEnum.subject_enum?.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Lớp */}
          <div className="form__row flex mb-5">
            <label
              className="form__label min-w-[125px] font-semibold"
              htmlFor="classes"
            >
              Lớp <RequiredIndicator />
            </label>
            <select
              className="w-[20vw] shadow-md border-2 border-custom_gray bg-gray-200 rounded-md py-1 px-2 text-[0.9rem] focus:outline-none"
              id="classes"
              value={selectedClasses}
              onChange={(e) => setSelectedClasses(e.target.value)}
            >
              {dataEnum.classes.map((classItem, index) => (
                <option key={index} value={classItem}>
                  Lớp {classItem}
                </option>
              ))}
            </select>
          </div>

          {/* Trình độ */}
          <div className="form__row flex mb-5 items-center">
            <label
              className="form__label min-w-[125px] font-semibold"
              htmlFor="levels"
            >
              Trình độ <RequiredIndicator />
            </label>
            <select
              className="w-[20vw] shadow-md border-2 border-custom_gray bg-gray-200 rounded-md py-1 px-2 text-[0.9rem] focus:outline-none"
              id="levels"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {dataEnum.background_enum?.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Số học viên */}
          <div className="form__row flex mb-5 items-center">
            <label
              className="form__label min-w-[125px] font-semibold"
              htmlFor="studentNumber"
            >
              Số học viên <RequiredIndicator />
            </label>
            <input
              className="w-[20vw] shadow-md border-2 border-custom_gray bg-gray-200 rounded-md py-1 px-2 text-[0.9rem] focus:outline-none"
              type="number"
              min="1"
              required
              id="studentNumber"
              value={studentNumber}
              onChange={(e) => setStudentNumber(Number(e.target.value))}
            />
          </div>

          {/* Học phí */}
          <div className="form__row flex mb-5 items-center">
            <label
              className="form__label min-w-[125px] font-semibold"
              htmlFor="fees"
            >
              Học phí (/h) <RequiredIndicator />
            </label>
            <input
              className="w-[20vw] shadow-md border-2 border-custom_gray bg-gray-200 rounded-md py-1 px-2 text-[0.9rem] focus:outline-none"
              type="text"
              required
              id="fees"
              value={feesView}
              onChange={(e) => handleChange(e)}
            />
          </div>

          {/* Địa chỉ */}
          <div className="form__row flex mb-5 items-center">
            <label
              className="form__label min-w-[125px] font-semibold"
              htmlFor="locations"
            >
              Địa chỉ <RequiredIndicator />
            </label>
            <input
              className="w-[20vw] shadow-md border-2 border-custom_gray bg-gray-200 rounded-md py-1 px-2 text-[0.9rem] focus:outline-none"
              type="text"
              required
              id="locations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Số buổi */}
          <div className="form__row flex mb-5 items-center">
            <label
              className="form__label min-w-[125px] font-semibold"
              htmlFor="days"
            >
              Số buổi (/tuần) <RequiredIndicator />
            </label>
            <input
              className="w-[20vw] shadow-md border-2 border-custom_gray bg-gray-200 rounded-md py-1 px-2 text-[0.9rem] focus:outline-none"
              type="number"
              id="days"
              min="0"
              max="7"
              placeholder="Số buổi học trong tuần không quá 7"
              required
              value={days}
              onChange={(e) => {
                let newDays = Number(e.target.value);
                if (newDays > 7) {
                  newDays = 7;
                }
                setDays(newDays);

                setClassTimes((prevClassTimes) => {
                  if (newDays > prevClassTimes.length) {
                    return [
                      ...prevClassTimes,
                      ...Array.from({
                        length: newDays - prevClassTimes.length,
                      }).map(() => ({
                        id: null,
                        weekday: "Thứ hai",
                        time_start: "",
                        time_end: "",
                      })),
                    ];
                  } else {
                    return prevClassTimes.slice(0, newDays);
                  }
                });
              }}
            />
          </div>

          {/* Thời gian */}
          <div className="form__row flex mb-5">
            <label
              className="form__label min-w-[125px] font-semibold"
              htmlFor="times"
            >
              Thời gian <RequiredIndicator />
            </label>
            <div className="flex flex-col">
              {Array.from({ length: days }).map((_, index) => (
                <div key={index} className="flex items-center mb-2">
                  <select
                    className="w-[8vw] shadow-md border-2 border-gray-300 bg-gray-200 rounded-md py-1 px-2 text-[0.9rem] focus:outline-none"
                    id={`session-${index}`}
                    value={classTimes[index]?.weekday || "Thứ hai"}
                    onChange={(e) => {
                      const updatedClassTimes = [...classTimes];
                      updatedClassTimes[index].weekday = e.target.value;
                      setClassTimes(updatedClassTimes);
                    }}
                  >
                    {dataEnum.sessions.map((session, index) => (
                      <option key={index} value={session}>
                        {session}
                      </option>
                    ))}
                  </select>

                  <div className="bg-black w-5"></div>

                  <div className="flex items-center space-x-2">
                    Từ &nbsp;
                    <input
                      required
                      type="time"
                      value={classTimes[index]?.time_start}
                      className="w-[8rem] py-1 px-3 bg-gray-200 border border-gray-300 rounded-md shadow-md focus:outline-none transition-all duration-150 ease-in-out"
                      onChange={(e) => {
                        const updatedClassTimes = [...classTimes];
                        const newTimeStart = e.target.value;

                        const conflictingTime = updatedClassTimes.some((time, idx) => {
                          return (
                            idx !== index &&
                            time.weekday === updatedClassTimes[index].weekday &&
                            newTimeStart < time.time_end && newTimeStart >= time.time_start
                          );
                        });

                        if (conflictingTime) {
                          alert("Khung giờ không được trùng lặp trong cùng một ngày.");
                        } else {
                          updatedClassTimes[index].time_start = newTimeStart;
                          setClassTimes(updatedClassTimes);
                        }
                      }}
                    />
                    &nbsp;đến&nbsp;
                    <input
                      required
                      type="time"
                      value={classTimes[index]?.time_end}
                      className="w-[8rem] py-1 px-3 bg-gray-200 border border-gray-300 rounded-md shadow-md focus:outline-none transition-all duration-150 ease-in-out"
                      onChange={(e) => {
                        const updatedClassTimes = [...classTimes];
                        const newTimeEnd = e.target.value;

                        if (newTimeEnd <= updatedClassTimes[index].time_start) {
                          alert("Thời gian kết thúc phải lớn hơn thời gian bắt đầu.");
                          return;
                        }

                        const conflictingTime = updatedClassTimes.some((time, idx) => {
                          return (
                            idx !== index &&
                            time.weekday === updatedClassTimes[index].weekday &&
                            newTimeEnd > time.time_start && newTimeEnd <= time.time_end
                          );
                        });

                        if (conflictingTime) {
                          alert("Khung giờ không được trùng lặp trong cùng một ngày.");
                        } else {
                          updatedClassTimes[index].time_end = newTimeEnd;
                          setClassTimes(updatedClassTimes);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="form__row flex mb-5">
            <label
              className="form__label min-w-[125px] font-semibold"
              htmlFor="note"
            >
              Ghi chú:
            </label>
            <div className="flex flex-col">
              <textarea
                className="w-[20vw] h-[10vh] shadow-md border-2 border-custom_gray bg-gray-200 rounded-md py-1 px-2 text-[0.9rem] focus:outline-none resize-none"
                id="note"
                value={note}
                maxLength={200}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="remaining1 text-slate-500 text-sm self-end mt-2">{note.length}/200</div>
            </div>
          </div>
          <div>
            <button className="flex bg-custom_darkblue p-2 rounded-lg ml-48">
              <p className="font-bold text-white mr-2">{func}</p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 54 54"
                fill="current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27 0.75C21.8083 0.75 16.7331 2.28954 12.4163 5.17392C8.0995 8.05831 4.73497 12.158 2.74817 16.9546C0.761374 21.7511 0.241536 27.0291 1.2544 32.1211C2.26726 37.2131 4.76733 41.8904 8.43846 45.5616C12.1096 49.2327 16.7869 51.7328 21.8789 52.7456C26.9709 53.7585 32.2489 53.2386 37.0455 51.2518C41.842 49.265 45.9417 45.9005 48.8261 41.5837C51.7105 37.2669 53.25 32.1918 53.25 27C53.25 20.0381 50.4844 13.3613 45.5616 8.43845C40.6387 3.51562 33.9619 0.75 27 0.75V0.75ZM25.125 40.4625C24.0309 40.8493 23.0831 41.5651 22.4118 42.5118C21.7404 43.4584 21.3783 44.5895 21.375 45.75V48.7688C17.9088 47.8698 14.7072 46.1565 12.0363 43.7712C9.36542 41.386 7.30244 38.3977 6.01881 35.0548C4.73518 31.7118 4.26798 28.1108 4.65605 24.551C5.04412 20.9911 6.27624 17.5753 8.25001 14.5875V23.25C8.25713 24.4073 8.62105 25.5343 9.29215 26.4772C9.96325 27.4201 10.9089 28.133 12 28.5187V30.75C12 32.2418 12.5926 33.6726 13.6475 34.7275C14.7024 35.7824 16.1332 36.375 17.625 36.375H23.25C23.7473 36.375 24.2242 36.5725 24.5758 36.9242C24.9275 37.2758 25.125 37.7527 25.125 38.25V40.4625ZM39.525 45.75C36.7697 42.6705 32.9802 40.7091 28.875 40.2375V38.25C28.875 36.7582 28.2824 35.3274 27.2275 34.2725C26.1726 33.2176 24.7419 32.625 23.25 32.625H17.625C17.1277 32.625 16.6508 32.4275 16.2992 32.0758C15.9476 31.7242 15.75 31.2473 15.75 30.75V28.875H21.375C22.8669 28.875 24.2976 28.2824 25.3525 27.2275C26.4074 26.1726 27 24.7418 27 23.25C27 22.7527 27.1976 22.2758 27.5492 21.9242C27.9008 21.5725 28.3777 21.375 28.875 21.375C31.3614 21.375 33.746 20.3873 35.5041 18.6291C37.2623 16.871 38.25 14.4864 38.25 12V7.5375C41.5679 9.44664 44.3438 12.1707 46.3152 15.452C48.2866 18.7333 49.3882 22.4633 49.5159 26.2891C49.6435 30.1149 48.793 33.9101 47.0447 37.3155C45.2965 40.7209 42.7083 43.6239 39.525 45.75V45.75Z"
                  fill="#D9D9D9"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <Popup
          open={showPopup}
          closeOnDocumentClick={false}
          onClose={() => setShowPopup(false)}
          position="right center"
          contentStyle={{ width: "400px", borderRadius: "10px", padding: "1%" }}
        >
          <div>
            <div className="">
              <p className="font-bold text-[1.1rem]">Xác nhận</p>
            </div>
            <hr className="my-2" />
            <p>Bạn chắc chắn muốn thực hiện ?</p>

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
                onClick={confirmSubmission}
              >
                <i className="fa-solid fa-check mr-2"></i>
                OK
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

FormPost.propTypes = {
  func: PropTypes.string,
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FormPost;
