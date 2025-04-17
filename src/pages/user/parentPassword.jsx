import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import axios from "axios";
import Panel from "../../layouts/panel/Panel";
import Parent from "../../layouts/PageAuthorization/parent/parent";
import User from '../../assets/image/User.png'

const ParentPassword = () => {
    const { setSessionToken, setRole, setId, sessionToken } = useAppContext()
    let navigate = useNavigate()
    const [formData, setFormData] = useState({
        parentname: '',
        email: '',
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [profileImage, setProfileImage] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const rawParentId = localStorage.getItem("id") || "";
    const token = localStorage.getItem("accessToken");
    const parentId = rawParentId.replace(/-/g, "");

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_ENDPOINT}/api/parents/${parentId}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    }
                );
                const data = response.data;
                setFormData({
                    ...formData,
                    parentname: data.parentname || '',
                    email: data.user.email || '',
                    username: data.user.username || '',
                });

                const avatarUrl = data.avatar && data.avatar !== 'Not recorded'
                    ? `${import.meta.env.VITE_API_ENDPOINT}${data.avatar}`
                    : User;
                setProfileImage(avatarUrl);

            } catch (error) {
                console.error("Error fetching parent data:", error);
            }
        };

        fetchParentData();
    }, [parentId, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChangePasswordClick = () => {
        setShowChangePassword(!showChangePassword);
    };

    const validatePasswordFormat = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleSavePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        if (!validatePasswordFormat(formData.newPassword)) {
            alert("Mật khẩu phải có tối thiểu 8 kí tự, trong đó có ít nhất 1 kí tự chữ và 1 kí tự số.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_ENDPOINT}/api/change-password/`,
                {
                    old_password: formData.currentPassword,
                    new_password: formData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                alert("Mật khẩu đã được thay đổi thành công.");
                setShowChangePassword(false);
                setSessionToken('')
                setRole('')
                setId('')
                navigate('/login')
            } else {
                alert("Đã xảy ra lỗi khi thay đổi mật khẩu.");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Đã xảy ra lỗi khi thay đổi mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Parent>
            <Panel activeItem={1}>
                <div className="relative p-4 overflow-y-auto">
                    <div className="w-full max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-shadow-md">Thông tin tài khoản</h2>
                        <div className="flex items-center mb-6">
                            <div className="flex-grow">
                                <div className="mb-4">
                                    <label className="block mb-1 font-bold">Tên người dùng</label>
                                    <p>{formData.parentname}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-bold">Email đăng nhập</label>
                                    <p>{formData.email}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-bold">Tên đăng nhập</label>
                                    <p>{formData.username}</p>
                                </div>
                            </div>
                            {profileImage && (
                                <div className="mr-44 ">
                                    <img
                                        src={profileImage || User}
                                        alt="Tutor Avatar"
                                        className="w-48 h-48 rounded-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={handleChangePasswordClick}
                                className="bg-blue-600 text-white px-6 py-2 rounded"
                            >
                                Thay đổi mật khẩu
                            </button>
                        </div>
                        {showChangePassword && (
                            <div className="mt-4">
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Nhập mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mb-4">
                                    *Lưu ý: Mật khẩu phải có tối thiểu 8 kí tự, trong đó có ít nhất 1 kí tự chữ và 1 kí tự số.
                                </p>
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSavePassword}
                                    className="bg-green-600 text-white px-6 py-2 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Panel>
        </Parent>
    );
};

export default ParentPassword;
