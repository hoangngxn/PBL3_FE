import { useNavigate } from "react-router-dom";
import Page from "../../layouts/login_signup/Page";

const ChangePasswordNotify = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Thay đổi đường dẫn nếu cần
  };

  return (
    <Page>
      <div className="flex flex-col items-center justify-center mt-[4rem]">
        <div className="bg-white p-8 rounded-lg max-w-xl shadow-lg text-center border-solid border-[1px] border-gray-400  min-h-[15rem]">
          <h2 className="text-2xl font-bold mb-4 border-solid border-b-[2px] border-gray-700 pb-5">
            Thông báo
          </h2>
          <p className="mb-6 mt-7">
            Bạn đã nhận được mật khẩu tạm thời. Vui lòng sử dụng mật khẩu này để
            đăng nhập và đổi mật khẩu mới để bảo mật tài khoản của bạn.
          </p>
          <button
            onClick={handleLogin}
            className="bg-yellow-400 text-black shadow-md font-semibold px-6 py-2 mt-5 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </Page>
  );
};

export default ChangePasswordNotify;
