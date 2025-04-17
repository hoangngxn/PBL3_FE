import Page from "../../layouts/login_signup/Page";
import Image1 from "../../assets/image/image_service_email.png";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/forgot-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        if (data.message === "Temporary password is sent to your password") {
          setMessage("Một mật khẩu tạm thời đã được gửi đến email của bạn.");
        }
      } else if (data.message === "User matching query does not exist.") {
        setError("Email không tồn tại.");
      }
    } catch {
      setError("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[25rem] h-[550px] bg-gray-200 ml-auto mr-auto items-center rounded-xl border-2 border-[#002182] -mt-12"
      >
        <h2 className="font-bold text-2xl pt-[60px] mb-3">Quên mật khẩu</h2>
        <img className="w-[120px] h-[120px] mb-5" src={Image1} alt="a" />
        <div className="flex gap-5 flex-col justify-center">
          <strong className="w-[100%] text-center">
            Vui lòng nhập email để nhận mật khẩu tạm thời
          </strong>
          <div className="flex items-center w-[100%] justify-center gap-2">
            {/* Icon email */}
            <svg
              className="w-[22px] h-[18px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48H48zM0 176v208c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
            </svg>
            <input
              className="border-b-2 justify-center border-neutral-950 bg-transparent py-1 outline-none w-[80%]"
              type="email"
              placeholder="Nhập email tại đây."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {isLoading && (
            <div className="flex justify-center mt-3">
              <ClipLoader color="#002182" size={40} />
            </div>
          )}
          {message && (
            <div className="flex justify-center w-auto">
              <p className="text-green-700 font-semibold text-center break-words max-w-[20rem]">
                {message}
              </p>
            </div>
          )}
          {error && (
            <div className="flex justify-center w-auto">
              <p className="text-red-500 text-center font-semibold mt-2">{error}</p>
            </div>
          )}
          <div className="flex flex-col justify-center items-center gap-3">
            {message && (
              <>
                <button
                  className="bg-green-600 text-white w-[310px] h-[40px] rounded-xl font-bold"
                  onClick={() => navigate("/changePasswordNotify")}
                >
                  Tiếp tục
                </button>
              </>
            )}
            <button
              type="submit"
              className="bg-custom_yellow w-[310px] h-[40px] rounded-xl font-bold"
              disabled={isLoading}
            >
              {isLoading && "Đang gửi..."}
              {!isLoading && !error && !message && "Gửi"}
              {!isLoading && (error || message) && "Gửi lại"}
            </button>
          </div>
          <div className="flex justify-center">
            <hr className="w-[60%] border-t-2 border-dashed border-black" />
          </div>
        </div>
      </form>
    </Page>
  );
};

export default ForgotPasswordPage;
