import Page from "../../layouts/login_signup/Page";
import Image1 from "../../assets/image/EMAILVECTOR.png";
import { useLocation, Link } from "react-router-dom";
const VerifyEmail = () => {
  const location = useLocation();
  const { email } = location.state || {};
  return (
    <Page>
      <form className="flex flex-col w-[25rem] bg-gray-200 ml-auto mr-auto items-center rounded-xl py-12 border-2 border-[#002182]">
        <h2 className="font-bold text-2xl mb-3">Xác minh tài khoản</h2>
        <img className="w-[120px] h-[120px]" src={Image1} alt="a" />
        <div className="flex gap-5 flex-col w-[100%] items-center">
          <p className="w-[80%] text-center">
            Vui lòng kiểm tra email{" "}
            <span className="font-bold text-blue-700">{email}</span> của bạn và
            nhấn vào link để kích hoạt tài khoản của bạn
          </p>
          <Link
            to="/"
            className="bg-custom_yellow px-5 py-2 rounded-xl mt-3 font-bold"
          >
            Trở lại
          </Link>
          <hr className="w-[60%] mx-auto border-t-2 border-dashed border-black" />
        </div>
      </form>
    </Page>
  );
};

export default VerifyEmail;
