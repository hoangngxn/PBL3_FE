import Picture from "../../assets/image/Teacher_and_student.png"
import { useNavigate } from "react-router-dom"

const Start = () => {
    const navigate = useNavigate()
    return (
        <div className="px-40 flex items-center space-x-10 mt-4 mb-12">
            <div className="w-[60%]">
                <div className="font-sriracha font-semibold text-3xl leading-[50px] text-center text-custom_purple mb-6">
                    <h1 className="mb-5 text-4xl">NOXA TUTOR</h1>
                    <h1>MÔI TRƯỜNG KẾT NỐI GIA SƯ VỚI NGƯỜI HỌC <br />NHANH CHÓNG, TIỆN LỢI, MỌI LÚC MỌI NƠI</h1>
                </div>
                <div className="font-poppins text-custom_gray text-center font-semibold mb-8">
                    <p className="mb-4">Dành cho mọi học sinh, mọi lứa tuổi.</p>
                    <p>Chúng tôi là một tổ chức phi lợi nhuận với sứ mệnh tạo nên một môi trường giúp tương tác giữa gia sư và người học một cách nhanh chóng, thuận lợi và hiệu quả</p>
                </div>
                <div className="flex items-center gap-12 justify-center">
                    <button
                        className="bg-custom_darkblue text-white w-36 py-2 rounded-md text-[0.9rem] font-semibold"
                        onClick={() => navigate('/login')}
                    >Tìm gia sư</button>
                    <button
                        className="bg-white text-custom_darkblue border-2 border-custom_darkblue w-36 py-2 rounded-md text-[0.9rem] font-semibold"
                        onClick={() => navigate('/register')}
                    >
                        Đăng kí gia sư</button>
                </div>
            </div>
            <div className="w-[35%]">
                <img src={Picture} alt="" />
            </div>
        </div>
    )
}

export default Start