import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Register_Form = () => {
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [confirmPassword, setConfirm] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError("Nhập đúng mật khẩu xác nhận");
    return;
  }

  if (password.length < 6 || password.length > 40) {
    setError("Mật khẩu phải từ 6-40 ký tự");
    return;
  }

  if (username.length < 3 || username.length > 20) {
    setError("Tên đăng nhập phải từ 3-20 ký tự");
    return;
  }

  const requestData = {
    username,
    email,
    password,
    role
  };

  console.log("Sending registration data:", requestData);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        setError("Không có quyền đăng ký. Vui lòng liên hệ quản trị viên.");
        return;
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        setError("Đã xảy ra lỗi khi đăng ký");
        return;
      }

      if (errorData.message?.includes("Username already taken") || 
          errorData.message?.includes("Email already taken")) {
        setError("Tài khoản hoặc email đã tồn tại");
      } else {
        setError(errorData.message || "Đã xảy ra lỗi khi đăng ký");
      }
      return;
    }

    // Only try to parse JSON for successful responses
    const data = await response.json();
    localStorage.setItem("username", data.username);
    navigate("/");
  } catch (error) {
    console.log(error);
    setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
  }
};

  return (
    <div className="bg-white shadow-lg rounded-3xl px-9 py-4 w-[400px] mx-auto border-2 border-[#002182] -mt-12">
      <h2 className="text-[1.5rem] font-bold text-center mb-6">Đăng Kí</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <div className="flex items-center border rounded-md shadow-sm">
            <span className="pl-3 text-custom_gray">
              <i className="far fa-envelope"></i>
            </span>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => (setEmail(e.target.value), setError(null))}
              className="border-0 w-full py-2 px-3 rounded-md focus:outline-none focus:shadow-outline"
              placeholder="Nhập email"
            />
          </div>
        </div>

        <div className="mb-4 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Tên đăng nhập
          </label>
          <div className="flex items-center border rounded-md shadow-sm">
            <span className="pl-3 text-custom_gray">
              <i className="far fa-user"></i>
            </span>
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => (setUsername(e.target.value), setError(null))}
              className="border-0 w-full py-2 px-3 rounded-md focus:outline-none focus:shadow-outline"
              placeholder="Nhập tên đăng nhập (3-20 ký tự)"
            />
          </div>
        </div>

        <div className="mb-4 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Mật khẩu
          </label>
          <div className="flex items-center border rounded-md shadow-sm">
            <span className="pl-3 text-custom_gray">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => (setPassword(e.target.value), setError(null))}
              className="border-0 w-full py-2 px-3 rounded-md focus:outline-none focus:shadow-outline"
              placeholder="Nhập mật khẩu (6-40 ký tự)"
            />
          </div>
        </div>

        <div className="mb-4 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Xác nhận mật khẩu
          </label>
          <div className="flex items-center border rounded-md shadow-sm">
            <span className="pl-3 text-custom_gray">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => (setConfirm(e.target.value), setError(null))}
              className="border-0 w-full py-2 px-3 rounded-md focus:outline-none focus:shadow-outline"
              placeholder="Xác nhận mật khẩu"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Vai trò
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="TUTOR"
                checked={role === "TUTOR"}
                onChange={(e) => (setRole(e.target.value), setError(null))}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Gia sư</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="STUDENT"
                checked={role === "STUDENT"}
                onChange={(e) => (setRole(e.target.value), setError(null))}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Học sinh</span>
            </label>
          </div>
        </div>
        <p
          className="text-red-500 text-center font-semibold -mt-2 mb-1"
          style={{
            height: "2rem",
          }}
        >
          {error}
        </p>
        <div className="flex items-center justify-center">
          <button
            className="bg-custom_yellow hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Đăng kí
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register_Form;
