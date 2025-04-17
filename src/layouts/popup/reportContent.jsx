import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "../../AppProvider";

const ReportContent = ({ reportedPartyId, postId, onClose, type, cmtId }) => {
    const { sessionToken, id } = useAppContext();
    const [selectedContents, setSelectedContents] = useState([]);
    const [textareaContent, setTextareaContent] = useState('');
    const reportContents = ['Nội dung không phù hợp', 'Ngôn từ tiêu cực', 'Ngôn từ gây thù ghét', 'Giả mạo danh tính', 'Xâm phạm quyền riêng tư', 'Spam']
    const handleCheckboxChange = (content) => {
        setSelectedContents((prevContents) =>
            prevContents.includes(content)
                ? prevContents.filter((item) => item !== content)
                : [...prevContents, content]
        );
    };

    const handleSubmit = async () => {
        const finalReportContents = [...selectedContents];
        if (textareaContent.trim()) {
            finalReportContents.push(textareaContent.trim());
        }

        console.log('Final Report Contents:', finalReportContents.join(', '));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/report/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reporter_id: id,
                    reported_party_id: reportedPartyId,
                    description: finalReportContents.join(', '),
                    type: type,
                    ...(type === "Đánh giá" ? { feedback_id: postId } : (type === "Bài đăng" ? { post_id: postId } : { comment_id: cmtId })),
                    ...(type === 'Bình luận' && { post_id: postId }),
                    created_at: Date.now()
                }),
            });
            if (response.ok) {
                toast.success('Báo cáo thành công', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                onClose()
            } else {
                toast.error('Báo cáo thất bại', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                if (type === 'Bình luận') {
                    toast.error('Bạn đã báo cáo bình luận này rồi', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            }
        } catch (error) {
            console.log(error)
        }
    };
    return (
        <div
            className='bg-slate-100 rounded-lg p-5 shadow-md border-2 border-slate-100'
        >
            <h2 className="font-bold text-center mb-5 text-2xl text-custom_darkblue">NỘI DUNG BÁO CÁO</h2>
            <div className='grid grid-cols-2 gap-5 gap-x-16 mb-5'>
                {
                    reportContents.map((content, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="contentCheck"
                                id={`contentCheck${index}`}
                                onChange={() => handleCheckboxChange(content)}
                            />
                            <label htmlFor={`contentCheck${index}`}>{content}</label>
                        </div>
                    ))
                }
            </div>
            <div className="w-full mb-4">
                <textarea
                    className="w-full h-[100px] outline-none p-2 rounded-md"
                    name=""
                    id=""
                    placeholder='Nội dung báo cáo...'
                    value={textareaContent}
                    onChange={(e) => setTextareaContent(e.target.value)}
                ></textarea>
            </div>
            <div className="flex justify-center gap-x-8">
                <button
                    onClick={() => {
                        onClose();
                    }}
                    className="px-8 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Gửi
                </button>
            </div>
        </div>
    )
}

ReportContent.propTypes = {
    onClose: PropTypes.func,
    reportedPartyId: PropTypes.string,
    postId: PropTypes.string,
    type: PropTypes.string.isRequired,
    cmtId: PropTypes.string
};


export default ReportContent