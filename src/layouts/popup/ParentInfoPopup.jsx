import PropTypes from "prop-types";
import User from "../../assets/image/User.png";

const sanitizeData = (value) => {
  return value === "Not recorded" ? "" : value;
};

const ParentInfoPopup = ({ isOpen, onClose, parent }) => {
  if (!isOpen || !parent) return null;

  const avatarUrl =
    parent.avatar === "Not recorded"
      ? User
      : `${import.meta.env.VITE_API_ENDPOINT}${parent.avatar}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="bg-custom_darkblue text-white p-6 rounded-t-lg">
          <h2 className="text-3xl font-bold text-center">Thông tin phụ huynh</h2>
        </div>
        <div className="p-4">
          <div className="flex justify-center mb-4">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border border-gray-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-1xl">
            <div className="flex flex-col gap-y-3">
              <p><strong>Họ tên:</strong> {sanitizeData(parent.parentname)}</p>
              <p><strong>Giới tính:</strong> {sanitizeData(parent.gender)}</p>
              <p><strong>Ngày sinh:</strong> {sanitizeData(parent.birthdate)}</p>
            </div>
            <div className="flex flex-col gap-y-3">
              <p><strong>Số điện thoại:</strong> {sanitizeData(parent.phone_number)}</p>
              <p><strong>Email:</strong> {sanitizeData(parent.user?.email)}</p>
              <p><strong>Địa chỉ:</strong> {sanitizeData(parent.address)}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-full shadow-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ParentInfoPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  parent: PropTypes.shape({
    avatar: PropTypes.string,
    parentname: PropTypes.string,
    gender: PropTypes.string,
    birthdate: PropTypes.string,
    phone_number: PropTypes.string,
    user: PropTypes.shape({
      email: PropTypes.string,
    }),
    address: PropTypes.string,
  }),
};

export default ParentInfoPopup;
