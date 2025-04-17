import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Panel from "../../layouts/panel/Panel";
import Tutor from "../../layouts/PageAuthorization/tutor/tutor";
import User from "../../assets/image/User.png";

const TutorProfile = () => {
  const backgroundEnum = [
    "Có bằng tốt nghiệp trung học phổ thông",
    "Sinh viên",
    "Tốt nghiệp đại học",
    "Tốt nghiệp đại học sư phạm",
    "Khác",
  ];
  const [formData, setFormData] = useState({
    tutor_id: "",
    username: "",
    email: "",
    role: "",
    tutorname: "",
    address: "",
    birthdate: "",
    bio_link: "",
    phone_number: "",
    gender: "",
    educational_background: backgroundEnum[0],
  });
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("Choose a file");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const rawTutorId = localStorage.getItem("id") || "";
  const token = localStorage.getItem("accessToken");
  const tutorId = rawTutorId.replace(/-/g, "");

    useEffect(() => {
        const fetchTutorData = async () => {
            if (!tutorId) {
                console.error("No tutor ID found in local storage.");
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_ENDPOINT}/api/tutors/${tutorId}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = response.data;
                console.log(data);

                setFormData({
                    tutor_id: data.tutor_id || '',
                    username: (data.user && data.user.username) || '',
                    email: (data.user && data.user.email) || '',
                    role: (data.user && data.user.role) || '',
                    tutorname: data.tutorname !== "" ? data.tutorname : '',
                    address: data.address !== "Not recorded" ? data.address : '',
                    birthdate: data.birthdate !== "" ? data.birthdate : '',
                    bio_link: data.bio_link !== "Not recorded" ? data.bio_link : '',
                    phone_number: data.phone_number !== "Not recorded" ? data.phone_number : '',
                    gender: data.gender !== "Not recorded" ? data.gender : 'Nam',
                    educational_background: data.educational_background !== "Not recorded" ? data.educational_background : 'Có bằng tốt nghiệp trung học phổ thông',
                });

                const avatarUrl = data.avatar && data.avatar !== 'Not recorded'
                    ? `${import.meta.env.VITE_API_ENDPOINT}${data.avatar}`
                    : User;
                setProfileImage(avatarUrl);

            } catch (error) {
                console.error("Error fetching tutor data:", error);
            }
        };

        fetchTutorData();
    }, [tutorId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      const phoneNumberPattern = /^[0-9]{0,11}$/;
      if (!phoneNumberPattern.test(value)) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

    const handleGenderChange = (e) => {
        const { value } = e.target;
        if (value !== formData.gender) {
            setFormData({ ...formData, gender: value });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;
            if (fileType !== "image/png" && fileType !== "image/jpeg") {
                alert("Please upload a .png or .jpg image.");
                fileInputRef.current.value = ""; // Reset file input
                setFileName("Choose a file"); // Reset file name display
                return;
            }

      const fileSizeLimit = 25 * 1024 * 1024;
      if (file.size > fileSizeLimit) {
        alert("Định dạng file phải là .png hoặc .jpg (25MB).");
        fileInputRef.current.value = "";
        setFileName("Chọn file");
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      updateAvatar(file);
    }
  };

  const formatFileName = (name) => {
    const maxLength = 15;
    const extension = name.slice(name.lastIndexOf("."));
    return name.length > maxLength
      ? `${name.slice(0, maxLength)}...${extension}`
      : name;
  };

  const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/profile/avatar/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

            console.log("Avatar updated successfully:", response.data);
            alert("Cập nhật avatar thành công!");

            window.location.reload();
        } catch (error) {
            console.error("Error updating avatar:", error);
            alert("Cập nhật avatar thất bại.");
        }
    };

    const handleSave = async () => {
        const requiredFields = [
            'tutorname',
            'gender',
            'birthdate',
            'address',
            'phone_number',
            'educational_background'
        ];

        const errors = {};

        requiredFields.forEach((field) => {
            if (!formData[field] || formData[field].trim() === '') {
                errors[field] = 'Thông tin bắt buộc';
            }
        });

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            alert('Hãy nhập tất cả thông tin bắt buộc.');
            return;
        }

        if (formData.phone_number.length < 10 || formData.phone_number.length > 11) {
            alert("Số điện thoại phải 10 hoặc 11 số.");
            return;
        }

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('tutorname', formData.tutorname);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('gender', formData.gender);
            formDataToSend.append('username', formData.username);
            formDataToSend.append('birthdate', formData.birthdate);
            formDataToSend.append('bio_link', formData.bio_link);
            formDataToSend.append('phone_number', formData.phone_number);
            formDataToSend.append('educational_background', formData.educational_background);

            const response = await axios.put(
                `${import.meta.env.VITE_API_ENDPOINT}/api/tutors/${tutorId}/`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Profile updated successfully:", response.data);
            alert("Cập nhật thành công!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Cập nhật thất bại.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <Tutor>
      <Panel role="tutor" activeItem={2}>
        <div className="relative h-full max-h-[600px] p-4">
          <div className="w-full max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md flex gap-6">
            <div className="flex flex-col items-center w-1/3 mt-16">
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              <label
                onClick={() => fileInputRef.current.click()}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
                title={fileName}
              >
                {formatFileName(fileName)}
              </label>
            </div>

                        <div className="w-2/3">
                            <h2 className="text-2xl font-bold mb-6 text-center">Tạo hồ sơ gia sư</h2>
                            <form className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-medium">Họ tên <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="tutorname"
                                        value={formData.tutorname}
                                        onChange={handleChange}
                                        className={`w-full border ${validationErrors.tutorname ? "border-red-500" : "border-gray-300"} p-2 rounded`}
                                    />
                                    {validationErrors.tutorname && <p className="text-red-500 text-sm">{validationErrors.tutorname}</p>}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Giới tính <span className="text-red-500">*</span></label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleGenderChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Ngày sinh <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        className={`w-full border ${validationErrors.birthdate ? "border-red-500" : "border-gray-300"} p-2 rounded`}
                                    />
                                    {validationErrors.birthdate && <p className="text-red-500 text-sm">{validationErrors.birthdate}</p>}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Địa chỉ hiện tại <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full border ${validationErrors.address ? "border-red-500" : "border-gray-300"} p-2 rounded`}
                                    />
                                    {validationErrors.address && <p className="text-red-500 text-sm">{validationErrors.address}</p>}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Số điện thoại <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className={`w-full border ${validationErrors.phone_number ? "border-red-500" : "border-gray-300"} p-2 rounded`}
                                    />
                                    {validationErrors.phone_number && <p className="text-red-500 text-sm">{validationErrors.phone_number}</p>}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Liên kết bio</label>
                                    <input
                                        type="text"
                                        name="bio_link"
                                        value={formData.bio_link}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Trình độ học vấn <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="educational_background"
                                        value={formData.educational_background}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    >
                                        {backgroundEnum.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.educational_background && (
                                        <p className="text-red-500 text-sm">
                                            {validationErrors.educational_background}
                                        </p>
                                    )}
                                </div>
                            </form>
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white px-6 py-2 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
        </Tutor>
    );
};

export default TutorProfile;
