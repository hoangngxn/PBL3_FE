import Page from "../../layouts/login_signup/Page";
import Image1 from "../../assets/image/image_service_email.png";
import Image2 from "../../assets/image/Ellipsis.png";
const CreateNewPassword = () => {
  return (
    <Page>
      <form className="flex flex-col w-[25rem] h-[550px] bg-gray-200 ml-auto mr-auto items-center rounded-xl -mt-8 py-10 px-2 border-2 border-[#002182]">
        <h2 className="font-bold text-[1.5rem] mb-3">Tạo mật khẩu mới</h2>
        <img className="w-[120px] h-[120px] mb-4" src={Image1} alt="a" />
        <div className="flex gap-5 flex-col w-[100%] items-center">
          <strong className="w-[70%] text-center">
            Mật khẩu mới phải khác với mật khẩu trước đó đã sử dụng
          </strong>
          <div className="flex items-center w-[100%] justify-center gap-2 px-2">
            <img className="w-[36px] h-[20px]" src={Image2} alt="" />
            <input
              className="border-b-2 justify-center border-neutral-950 bg-transparent py-1 outline-none w-[80%]"
              type="password"
            />
          </div>
          <div className="flex items-center w-[100%] justify-center gap-2 px-2">
            <img className="w-[36px] h-[20px]" src={Image2} alt="" />
            <input
              className="border-b-2 justify-center border-neutral-950 bg-transparent py-1 outline-none w-[80%]"
              type="password"
            />
          </div>
          <div className="w-full flex justify-center my-2">
            <button className="bg-custom_yellow w-[90%] py-3 rounded-xl font-bold">
              Gửi
            </button>
          </div>
          <hr className="w-[60%] mx-auto border-t-2 border-dashed border-black" />
        </div>
      </form>
    </Page>
  );
};

export default CreateNewPassword;
