import PropTypes from 'prop-types';

const DeleteAccount = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-auto">
        <h3 className="text-lg font-semibold mb-4">Xác nhận khóa tài khoản</h3>
        <p className="mb-4">Bạn có chắc chắn muốn khóa tài khoản này không?</p>
        <div className="flex justify-end">
          <button
            className="bg-[#002182] text-white font-bold py-1 px-4 rounded mr-2 hover:bg-blue-600 transition duration-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-red-500 text-white font-bold py-1 px-4 rounded hover:bg-red-600 transition duration-300"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteAccount.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteAccount;
