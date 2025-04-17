import { useState, useEffect } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { BsFillPostcardFill, BsPersonVideo3 } from 'react-icons/bs';
import { MdPendingActions } from "react-icons/md";

const StatsSection = () => {
    const [statsData, setStatsData] = useState({
        tutorsTotal: 0,
        parentsTotal: 0,
        postsTotal: 0,
        queue: 0,
    });

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                  `${import.meta.env.VITE_API_ENDPOINT}/api/statistics/`
                );
                const data = await response.json();
                const { tutors_total, parents_total, posts_total, queue } = data.data.summary_stat;

                // Cập nhật state với dữ liệu từ API
                setStatsData({
                    tutorsTotal: tutors_total,
                    parentsTotal: parents_total,
                    postsTotal: posts_total,
                    queue: queue,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const stats = [
        { icon: <FaUserAlt className="text-purple-400 text-2xl h-8" />, label: 'Tài khoản phụ huynh', count: `${statsData.parentsTotal}` },
        { icon: <BsPersonVideo3 className="text-green-400 text-2xl h-8" />, label: 'Tài khoản gia sư', count: `${statsData.tutorsTotal}` },
        { icon: <BsFillPostcardFill className="text-yellow-400 text-2xl h-8" />, label: 'Bài đăng đã duyệt', count: `${statsData.postsTotal}` },
        { icon: <MdPendingActions className="text-blue-400 text-3xl h-8" />, label: 'Bài đăng chờ duyệt', count: `${statsData.queue}` },
    ];

    return (
        <section className="py-3 bg-transparent">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 text-center"
                        >
                            <div className="mb-1">{stat.icon}</div>
                            <p className="text-gray-500 font-medium mb-2">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-800">{stat.count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
