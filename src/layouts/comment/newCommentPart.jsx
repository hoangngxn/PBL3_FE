import { useState } from 'react';
import { useAppContext } from '../../AppProvider';
import PropTypes from "prop-types";
import ImgAvatar from "../../assets/image/User.png";
import { IoIosSend, IoMdClose } from "react-icons/io";
import Comment from './comment';
import { CommentProvider, useAppContext as useCommentContext } from '../provider/commentProvider';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const NewCommentPart = ({ data, avatar, role }) => {
    const { id, sessionToken } = useAppContext();
    const { replyStatus, setReplyStatus } = useCommentContext();
    const [reply, setReplyComment] = useState('');
    const [showCmtChild, setShowCmtChild] = useState(false);
    const [newCmt, setNewCmt] = useState([])

    const handlePostComment = async (idPost, idCmt) => {
        if (reply.trim() === '') return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/postcomments/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    post_id: idPost,
                    user_id: id,
                    comment_parent_id: idCmt,
                    comment: reply
                }),
            });

            const newComment = await response.json();
            if (response.ok) {
                if (role === "parent") {
                    console.log('aaaa');
                    setNewCmt((prev) => [{ data: newComment, cmtChildShow: [] }, ...prev])
                    data.cmtChildShow.push(newComment)
                } else {
                    data.cmtChildShow.unshift(newComment)
                }
                setShowCmtChild(true);
                setReplyComment('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Comment dataUser={data?.data.user} time={data?.data.created_at} isMyCmt={data.data.is_my_comment} comment={data?.data.comment || ''} role={role} isDeleted={data.data.is_deleted} />

            {showCmtChild && (
                role === 'parent' ? (
                    newCmt?.map((comment, index) => (
                        <div
                            key={index}
                        >
                            <CommentProvider>
                                <NewCommentPart data={comment} avatar={avatar} role='children' />
                            </CommentProvider>
                        </div>
                    ))
                ) : (
                    data.cmtChildShow.map((childComment, index) => (
                        <Comment
                            key={childComment.id || index}
                            dataUser={childComment.user}
                            time={childComment.created_at}
                            comment={childComment.comment}
                            isMyCmt={childComment.is_my_comment}
                            role="childrenChild"
                            id={childComment.comment_id}
                            postId={childComment.post_id}
                            isDeleted={childComment.is_deleted}
                        />
                    ))
                )
            )}

            <div className={`flex mb-2 ${role === 'children' ? 'pl-28' : 'pl-14'}`}>
                {!showCmtChild && data.cmtChildShow.length > 0 && (
                    <div
                        className='flex items-center cursor-pointer group'
                        onClick={() => setShowCmtChild(true)}
                    >
                        <div className="w-[2rem] h-[0.1rem] bg-gray-400 font-bold mr-3"></div>
                        <p className='text-[0.85rem] text-gray-600 text-nowrap group-hover:underline'>
                            Xem thêm {data.cmtChildShow.length} câu trả lời
                        </p>
                        <FaChevronDown className='ml-2 w-3 h-3 text-gray-600 mr-5' />
                    </div>
                )}

                {showCmtChild && data.cmtChildShow.length > 0 && (
                    <div
                        className='flex items-center cursor-pointer group ml-3'
                        onClick={() => setShowCmtChild(false)}
                    >
                        <p className='group-hover:underline text-[0.85rem] text-gray-600'>Ẩn</p>
                        <FaChevronUp className='ml-2 w-2 h-2 text-gray-600' />
                    </div>
                )}
            </div>

            {replyStatus && (
                <div className={`flex justify-between items-center mt-3 mb-7 ${role === 'children' ? 'pl-28' : 'pl-14'}`}>
                    <div className='w-[100%] mr-2 flex'>
                        <div className='w-[50px] mr-2 flex'>
                            <img
                                src={avatar ? `${import.meta.env.VITE_API_ENDPOINT}${avatar}` : ImgAvatar}
                                alt="avatar"
                                className="rounded-full w-[40px] h-[40px] mr-3 object-cover"
                            />
                        </div>

                        <div className='relative w-[88%]'>
                            <input
                                type="text"
                                className='w-full py-2 bg-transparent border-2 border-custom_gray text-[0.9rem] rounded-3xl pl-3 pr-10 focus:border-black'
                                placeholder='Thêm bình luận...'
                                maxLength={500}
                                value={reply}
                                onChange={(e) => setReplyComment(e.target.value)}
                            />
                            <IoMdClose
                                className='w-6 h-6 absolute right-3 top-2 cursor-pointer'
                                onClick={() => setReplyStatus(!replyStatus)}
                            />
                        </div>
                    </div>

                    <div
                        className='border-2 p-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer'
                        onClick={() => handlePostComment(data.data.post_id, data.data.comment_id)}
                    >
                        <IoIosSend />
                    </div>
                </div>
            )}
        </div>
    );
};

NewCommentPart.propTypes = {
    data: PropTypes.object,
    avatar: PropTypes.string,
    role: PropTypes.string,
    index: PropTypes.number
};

export default NewCommentPart;