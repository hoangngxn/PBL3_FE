import { useState } from "react";
import PropTypes from "prop-types";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";

const SideBarSearchParent = ({ setFilters }) => {

  let navigate = useNavigate();
  const { role, dataEnum } = useAppContext();
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("Môn học");
  const [selectedFee, setSelectedFee] = useState("Học phí (/h)");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);

  //Num_Student
  const [minStudents, setMinStudents] = useState(1);
  const [maxStudents, setMaxStudents] = useState(100);
  const [selectStudent, setSelectStudents] = useState("Số học viên");

  const applyFilters = () => {
    setFilters({
      subject: selectedSubject,
      fee: selectedFee,
      minStudents: minStudents,
      maxStudents: maxStudents,
      grade: selectedClasses,
      sessions: selectedSessions,
    });
  };

  // Hàm xử lý khi bấm vào từng mục
  const toggleDropdown = (dropdownName) => {
    if (selectedDropdown === dropdownName) {
      setSelectedDropdown(null); // Đóng dropdown nếu đang mở
    } else {
      setSelectedDropdown(dropdownName); // Mở dropdown tương ứng
    }
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setSelectedDropdown(null);
  };

  const handleSelectFee = (fee) => {
    setSelectedFee(fee);
    setSelectedDropdown(null);
  };

  const handleMinStudentsChange = (event) => {
    const value = parseInt(event.target.value);
    if (value <= maxStudents) {
      setMinStudents(value);
      if (value === maxStudents) {
        setSelectStudents(`${value} học viên`);
      } else {
        setSelectStudents(`Từ ${value} đến ${maxStudents} học viên`);
      }
    } else {
      alert("Yêu cầu nhập đúng thông tin");
    }
  };

  const handleMaxStudentsChange = (event) => {
    const value = parseInt(event.target.value);
    if (value >= minStudents) {
      setMaxStudents(value);
      if (value === minStudents) {
        setSelectStudents(`${value} học viên`);
      } else {
        setSelectStudents(`Từ ${minStudents} đến ${value} học viên`);
      }
    } else {
      alert("Yêu cầu nhập đúng thông tin");
    }
  };

  const handleClassChange = (event) => {
    const value = event.target.value;

    setSelectedClasses((prevSelectedClasses) => {
      if (event.target.checked) {
        // Nếu checkbox được chọn, thêm lớp học vào danh sách
        return [...prevSelectedClasses, value];
      } else {
        // Nếu checkbox bị bỏ chọn, xóa lớp học khỏi danh sách
        return prevSelectedClasses.filter((classItem) => classItem !== value);
      }
    });
  };

  const handleSessionSelection = (sessionItem) => {
    if (selectedSessions.includes(sessionItem)) {
      setSelectedSessions(
        selectedSessions.filter((item) => item !== sessionItem)
      );
    } else {
      setSelectedSessions([...selectedSessions, sessionItem]);
    }
  };

  return (
    <div className="flex flex-col w-80 p-6 font-poppins">
      <div className="flex flex-row items-center text-white bg-[#002182] p-3 rounded-md">
        <i className="fas fa-bars text-[#F1BB45]"></i>
        <span className="text-lg font-semibold ml-3">BỘ LỌC TÌM KIẾM</span>
      </div>

      <div className="mt-4 space-y-4 p-3 bg-yellow-500 rounded-md font-semibold">
        {/* Môn học */}
        <div className="flex flex-col">
          <div
            className="flex items-center justify-between bg-yellow-400 p-2 rounded-md cursor-pointer hover:bg-yellow-300"
            onClick={() => toggleDropdown("subjects")}
          >
            <span className="flex items-center">
              <i className="fas fa-book mr-2"></i> {selectedSubject}
            </span>
            <i
              className={`fas fa-chevron-down transition-transform duration-2000 ${selectedDropdown === "subjects" ? "transform rotate-180" : ""
                }`}
            ></i>
          </div>
          {selectedDropdown === "subjects" && (
            <ul className="bg-white mt-2 rounded-md p-2 space-y-2 max-h-48 overflow-y-auto">
              {dataEnum.subject_enum.map((subject, index) => (
                <li
                  key={index}
                  className="hover:bg-yellow-200 p-2 rounded-md cursor-pointer"
                  onClick={() => handleSelectSubject(subject)}
                >
                  {subject}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Lớp */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between bg-yellow-400 p-2 rounded-md cursor-pointer hover:bg-yellow-300">
            <span className="flex items-center">
              <i className="fas fa-chalkboard-teacher mr-2"></i> Lớp
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-2 ml-2">
          {dataEnum.classes.map((classItem, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={classItem}
                value={classItem}
                onChange={handleClassChange} // Xử lý sự kiện thay đổi trạng thái checkbox
              />
              <label htmlFor={classItem} className="ml-2">
                Lớp {classItem}
              </label>
            </div>
          ))}
        </div>

        {/* Học phí */}
        <div className="flex flex-col">
          <div
            className="flex items-center justify-between bg-yellow-400 p-2 rounded-md cursor-pointer hover:bg-yellow-300"
            onClick={() => toggleDropdown("fees")}
          >
            <span className="flex items-center">
              <i className="fas fa-dollar-sign mr-2"></i> {selectedFee}
            </span>
            <i
              className={`fas fa-chevron-down transition-transform duration-2000 ${selectedDropdown === "fees" ? "transform rotate-180" : ""
                }`}
            ></i>
          </div>
          {selectedDropdown === "fees" && (
            <ul className="bg-white mt-2 rounded-md p-2 space-y-2 max-h-48 overflow-y-auto">
              {dataEnum.fees.map((fee, index) => (
                <li
                  key={index}
                  className="hover:bg-yellow-200 p-2 rounded-md cursor-pointer"
                  onClick={() => handleSelectFee(fee)}
                >
                  {fee}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Số học viên */}
        <div className="flex flex-col">
          <div
            className="flex items-center justify-between bg-yellow-400 p-2 rounded-md cursor-pointer hover:bg-yellow-300"
            onClick={() => toggleDropdown("students")}
          >
            <span className="flex items-center">
              <i className="fas fa-users mr-2"></i>
              {selectStudent}
            </span>
            <i
              className={`fas fa-chevron-down transition-transform duration-2000 ${selectedDropdown === "students" ? "transform rotate-180" : ""
                }`}
            ></i>
          </div>
          {selectedDropdown === "students" && (
            <div className="bg-white mt-2 rounded-md p-2 border-2">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <label htmlFor="min-students">Số học viên ít nhất</label>
                  <input
                    type="number"
                    id="min-students"
                    value={minStudents}
                    onChange={handleMinStudentsChange}
                    min="1"
                    className="border rounded-md p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="max-students">Số học viên nhiều nhất</label>
                  <input
                    type="number"
                    id="max-students"
                    value={maxStudents}
                    onChange={handleMaxStudentsChange}
                    min={minStudents}
                    className="border rounded-md p-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Số buổi */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between bg-yellow-400 p-2 rounded-md cursor-pointer hover:bg-yellow-300">
            <span className="flex items-center">
              <i className="fas fa-calendar-alt mr-2"></i> Buổi
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-2 ml-2">
          {dataEnum.sessions.map((classItem, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={classItem}
                value={classItem}
                onChange={() => handleSessionSelection(classItem)}
                checked={selectedSessions.includes(classItem)}
              />
              <label htmlFor={classItem} className="ml-2">
                {classItem}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4 space-x-4">
        <button
          className="bg-[#002182] w-[10vw] text-white py-2 px-4 rounded-md"
          onClick={() => {
            if (
              window.confirm(
                "Bạn có chắc chắn muốn xóa tất cả dữ liệu lọc không ?"
              )
            ) {
              window.location.reload();
            }
          }}
        >
          Xóa tất cả
        </button>
        <button
          className="bg-[#002182] w-[10vw] text-white py-2 px-4 rounded-md"
          onClick={applyFilters}
        >
          Áp dụng
        </button>
      </div>
      {role === "parent" && (
        <button
          className="bg-custom_yellow text-black mt-4 py-2 px-4 rounded-md w-full"
          onClick={() => navigate(`/parent/create-post`)}
        >
          Tạo bài đăng mới
        </button>
      )}
    </div>
  );
};

SideBarSearchParent.propTypes = {
  setFilters: PropTypes.func.isRequired,
};

export default SideBarSearchParent;
