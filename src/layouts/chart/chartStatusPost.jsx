import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PostStatusBarChart = () => {
    const [postData, setPostData] = useState({
        created: 0,
        approved: 0,
        rejected: 0,
        closed: 0,
    });
    const [showInsight, setShowInsight] = useState(false); // State to toggle insight visibility

    // Fetch dữ liệu API và ánh xạ
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                  `${import.meta.env.VITE_API_ENDPOINT}/api/statistics/?category=posts`
                );
                const data = await response.json();
                const postsStatByStatus = data.data.posts_stat_by_status;

                setPostData({
                    created: postsStatByStatus.pending_approval.posts,
                    approved: postsStatByStatus.approved.posts,
                    rejected: postsStatByStatus.rejected.posts,
                    closed: postsStatByStatus.closed.posts,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Calculate the most and least frequent post statuses
    const statusData = [
        { label: 'Chờ duyệt', count: postData.created },
        { label: 'Đã duyệt', count: postData.approved },
        { label: 'Bị từ chối', count: postData.rejected },
        { label: 'Đã đóng', count: postData.closed },
    ];
    const maxStatus = statusData.reduce((prev, current) => (current.count > prev.count ? current : prev));
    const minStatus = statusData.reduce((prev, current) => (current.count < prev.count ? current : prev));

    // Dữ liệu cho biểu đồ
    const chartData = {
        labels: ['Chờ duyệt', 'Đã duyệt', 'Bị từ chối', 'Đã đóng'],
        datasets: [
            {
                label: 'Phân phối bài đăng',
                data: [
                    postData.created,
                    postData.approved,
                    postData.rejected,
                    postData.closed,
                ],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                ],
                borderColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Các tùy chọn cho biểu đồ
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Số lượng bài đăng',
                    font: {
                        weight: 'bold',
                    },
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Trạng thái bài đăng',
                    font: {
                        weight: 'bold',
                    },
                },
            },
        },
    };

    const totalPosts = postData.created + postData.approved + postData.rejected + postData.closed;

    return (
        <div style={{ width: '100%', margin: '0 auto', padding: '0.5rem 1rem' }}>
            <div className='flex justify-between'>
                <h3 className='font-bold mb-3'>Phân phối trạng thái bài đăng</h3>
                <p className="mb-3">Tổng số bài đăng: <strong>{totalPosts}</strong></p>
            </div>
            <Bar data={chartData} options={options} />
                <div style={{ marginTop: '1rem' }}>
                    <p>
                        Trạng thái có nhiều bài đăng nhất là <strong>{maxStatus.label}</strong> với <strong>{maxStatus.count}</strong> bài đăng.<br />
                        Trạng thái có ít bài đăng nhất là <strong>{minStatus.label}</strong> với <strong>{minStatus.count}</strong> bài đăng.
                    </p>
                </div>
        </div>
    );
};

PostStatusBarChart.propTypes = {
    postData: PropTypes.shape({
        created: PropTypes.number.isRequired,
        approved: PropTypes.number.isRequired,
        rejected: PropTypes.number.isRequired,
        closed: PropTypes.number.isRequired,
    }).isRequired,
};

export default PostStatusBarChart;
