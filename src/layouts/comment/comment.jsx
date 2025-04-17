import PropTypes from "prop-types";
import { useEffect, useState } from 'react'
import avatar from "../../assets/image/User.png"
import {
    FaCircle
} from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { GoReport } from "react-icons/go";
import { useAppContext as useCommentContext } from '../provider/commentProvider';
import ReportContent from "../popup/reportContent";
import { useAppContext } from "../../AppProvider";


const Comment = ({ dataUser, time, comment, isMyCmt, role, id, postId, isDeleted }) => {
    const { role: roleContext } = useAppContext()
    const [isReply, setIsReply] = useState(false)
    const [isReport, setIsReport] = useState(false)
    const [showReport, setShowReport] = useState(false)

    const { replyStatus, setReplyStatus } = useCommentContext()
    useEffect(() => {
        setIsReply(replyStatus)
    }, [replyStatus])

    const handleReply = () => {
        setIsReply(!isReply)
        setReplyStatus(!isReply)
    }

    function formatTime(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} giây trước`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} tiếng trước`;
        } else {
            return createdDate.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        }
    }

    return (
        <div>
            <div
                className={`flex w-full items-center mb-5 ${role === 'children'
                    ? 'pl-14 mb-2'
                    : role === 'childrenChild'
                        ? 'pl-28 mb-2'
                        : 'mb-2'
                    }`}
            >
                <div className='flex'>
                    <div className='w-[50px] mr-2'>
                        <img
                            src={dataUser?.avatar ? `${import.meta.env.VITE_API_ENDPOINT}${dataUser.avatar}` : avatar}
                            width={40}
                            height={40}
                            alt="avatar"
                            className="rounded-full w-[40px] h-[40px] object-cover"
                        />
                    </div>
                    <div className='w-[100%]'>
                        <div className='flex items-center'>
                            <p className='font-semibold'>{dataUser?.tutorname || dataUser?.username}</p>
                            <FaCircle className='w-[6px] h-[6px] text-primaryColorGray mx-3' />
                            <p className='font-light text-primaryColorGray text-[0.8rem]'>{formatTime(time || '')}</p>
                        </div>
                        <div className='text-[0.9rem]'>
                            {
                                isDeleted ? (
                                    <div className='text-[0.85rem] text-red-800 line-clamp-3 hover:line-clamp-none bg-red-100 p-2 rounded-lg shadow-md font-bold my-2'>
                                        <p className='text-justify'>{comment}</p>
                                    </div>
                                ) : (
                                    <div className='text-[0.9rem] line-clamp-3 hover:line-clamp-none'>
                                        <p className='text-justify'>{comment}</p>
                                    </div>
                                )
                            }

                        </div>
                        {
                            roleContext !== 'admin' && (
                                <div className='flex items-center mt-1 relative'>
                                    <p
                                        className='inline-block font-semibold text-[0.9rem] hover:cursor-pointer'
                                        onClick={handleReply}
                                    >Trả lời</p>
                                    {
                                        (!isMyCmt && roleContext !== "admin" && !isDeleted) && (
                                            <>
                                                <FiMoreHorizontal
                                                    className='ml-2 text-primaryColorGray cursor-pointer'
                                                    onClick={() => setIsReport(!isReport)}
                                                />
                                                {isReport && (
                                                    <div
                                                        className='absolute flex font-semibold items-center bg-slate-100 rounded-lg cursor-pointer z-10 shadow-lg px-2 py-2 top-5 left-10 hover:text-red-500'
                                                        onClick={() => setShowReport(true)}
                                                    >
                                                        <GoReport />
                                                        <p className='ml-2 text-[0.9rem]'>Report</p>
                                                    </div>
                                                )}
                                            </>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            {
                showReport && (
                    <div className="fixed inset-0 bg-black/70 z-40">
                        <div className="fixed inset-0 flex items-center justify-center z-40">
                            <ReportContent
                                onClose={() => setShowReport(false)}
                                type="Bình luận"
                                reportedPartyId={dataUser.id}
                                postId={postId}
                                cmtId={id}
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

Comment.propTypes = {
    dataUser: PropTypes.object,
    time: PropTypes.string,
    comment: PropTypes.string,
    isMyCmt: PropTypes.bool,
    role: PropTypes.string,
    id: PropTypes.string,
    postId: PropTypes.string,
    isDeleted: PropTypes.bool
};

export default Comment