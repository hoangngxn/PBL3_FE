import PropTypes from "prop-types";
import { useAppContext } from "../../AppProvider";
import { useEffect, useState } from 'react';
import { FaCommentAlt } from "react-icons/fa";
import ImgAvatar from "../../assets/image/User.png";
import { IoIosSend, IoMdClose } from "react-icons/io";
import { CommentProvider } from '../provider/commentProvider';
import CommentPart from '../comment/commentPart';
import NewCommentPart from "../comment/newCommentPart";

const CommentSection = ({ idPost, onClose }) => {
    const { id, sessionToken, role } = useAppContext();
    const [comments, setComments] = useState([]);
    const [totalComment, setTotalCmt] = useState(0);
    const [reply, setReplyStatus] = useState('');
    const [avatar, setAvatar] = useState('');
    const [newCmt, setNewCmt] = useState([])

    useEffect(() => {
        if (role !== 'admin') {
            const fetchData = async () => {
                try {
                    const url = `${import.meta.env.VITE_API_ENDPOINT}/api/${role === 'tutor' ? 'tutors' : 'parents'}/${id}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    setAvatar(data.avatar);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [id, role]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/postcomments/${idPost}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            setComments(data.comments);
            setTotalCmt(data.total_comments);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchComments(); // Fetch comments when component mounts
    }, [idPost]);

    const handPostCmt = async () => {
        if (reply.trim() === '') return; // Prevent posting empty comments

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
                    comment_parent_id: '',
                    comment: reply
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setNewCmt((prev) => [{ data: data, cmtChildShow: [] }, ...prev])
                setTotalCmt((prevTotal) => prevTotal + 1);
                setReplyStatus('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 shadow-md z-20"
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className='w-[40%] h-[75%] p-6 bg-white'>
                <div className='flex justify-between items-end'>
                    <div className='flex items-center text-primaryColorGray'>
                        <FaCommentAlt />
                        <p className='ml-2'>{totalComment} bình luận</p>
                    </div>
                </div>
                <div className="w-full h-[0.125rem] bg-gray-500 mt-2 mb-5"></div>
                <div className={`min-h-[120px] ${role !== 'admin' ? 'h-[77%]' : 'h-[85%]'} overflow-auto pr-4 scrollbar-thin scrollbar-thumb-transparent/30 scrollbar-track-transparent`}>
                    {newCmt?.map((comment, index) => (
                        <div
                            key={index}
                        >
                            <CommentProvider>
                                <NewCommentPart data={comment} avatar={avatar} role='parent' />
                            </CommentProvider>
                        </div>
                    ))}
                    {comments?.map((comment, index) => (
                        <div
                            key={index}
                        >
                            <CommentProvider>
                                <CommentPart data={comment} avatar={avatar} role='parent' />
                            </CommentProvider>
                        </div>
                    ))}
                </div>
                {
                    role !== 'admin' && (
                        <div className='flex justify-between items-center mt-5'>
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
                                        onChange={(e) => setReplyStatus(e.target.value)}
                                    />
                                    <IoMdClose
                                        className='w-6 h-6 absolute right-3 top-2 cursor-pointer'
                                        onClick={() => setReplyStatus('')}
                                    />
                                </div>
                            </div>

                            <div
                                className='border-2 p-2 rounded-full bg-white text-custom_gray hover:text-black hover:border-black transition-all duration-300 cursor-pointer'
                                onClick={handPostCmt}
                            >
                                <IoIosSend />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

CommentSection.propTypes = {
    idPost: PropTypes.string,
    onClose: PropTypes.func,
};

export default CommentSection;