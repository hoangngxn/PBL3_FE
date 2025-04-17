import PropTypes from "prop-types";

const ClassTimeDetail = ({ classTimes, onClose }) => {
  console.log('classtime: ', classTimes);

  const weekdayOrder = {
    "Thứ hai": 1,
    "Thứ ba": 2,
    "Thứ tư": 3,
    "Thứ năm": 4,
    "Thứ sáu": 5,
    "Thứ bảy": 6,
    "Chủ nhật": 7,
  };

  const sortedClassTimes = [...classTimes].sort(
    (a, b) => weekdayOrder[a.weekday] - weekdayOrder[b.weekday]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[500px] flex flex-col transition-transform transform scale-100">
        <h2 className="text-[1.5rem] font-bold mb-6 text-center text-[#002182]">
          CHI TIẾT BUỔI HỌC
        </h2>
        <ul className="list-disc pl-5 mb-4">
          {sortedClassTimes.map((time, index) => (
            <li key={index} className="text-lg mb-2">
              <span className="font-semibold">{time.weekday}</span> -{" "}
              {time.time_start.slice(0, 5)} đến {time.time_end.slice(0, 5)}
            </li>
          ))}
        </ul>
        <button
          className="mt-2 font-bold bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition duration-300 w-[20%] self-center"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

ClassTimeDetail.propTypes = {
  classTimes: PropTypes.arrayOf(
    PropTypes.shape({
      weekday: PropTypes.string,
      time_start: PropTypes.string,
      time_end: PropTypes.string,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ClassTimeDetail;
