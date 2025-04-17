import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SubjectPostsBarChart = () => {
    const [postCounts, setPostCounts] = useState([]);
    const [showInsight, setShowInsight] = useState(false);

    const subjectEnum = [
        'Toán', 'Văn học', 'Vật lý', 'Hóa học', 'Sinh học',
        'Tiếng Anh', 'Lịch sử', 'Địa lý', 'Kinh tế', 'Khoa học máy tính', 'Khác'
    ];

    const subjectMapping = {
        'Toán': 'math',
        'Văn học': 'literature',
        'Vật lý': 'physics',
        'Hóa học': 'chemistry',
        'Sinh học': 'biology',
        'Tiếng Anh': 'english',
        'Lịch sử': 'history',
        'Địa lý': 'geography',
        'Kinh tế': 'economy',
        'Khoa học máy tính': 'computer_science',
        'Khác': 'other'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                  `${import.meta.env.VITE_API_ENDPOINT}/api/statistics/?category=posts`
                );
                const data = await response.json();
                const postsStatBySubjects = data.data.posts_stat_by_subjects;

                const postCountsArray = subjectEnum.map(subject => {
                    const apiSubject = subjectMapping[subject];
                    return postsStatBySubjects[apiSubject]?.posts || 0;
                });
                setPostCounts(postCountsArray);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Calculate the subject with the most and least posts
    const maxPosts = Math.max(...postCounts);
    const minPosts = Math.min(...postCounts);
    const mostPostedSubject = subjectEnum[postCounts.indexOf(maxPosts)];
    const leastPostedSubject = subjectEnum[postCounts.indexOf(minPosts)];

    // Chart data
    const chartData = {
        labels: subjectEnum,
        datasets: [
            {
                label: 'Số lượng bài đăng',
                data: postCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    footer: () => [
                        `Môn có nhiều bài đăng nhất: ${mostPostedSubject} với ${maxPosts} bài đăng`,
                        `Môn có ít bài đăng nhất: ${leastPostedSubject} với ${minPosts} bài đăng`
                    ],
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Môn học',
                    font: {
                        weight: 'bold',
                    },
                },
            },
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
        },
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <h3 className='font-bold mb-3'>Số lượng bài đăng theo môn học</h3>
            <Bar data={chartData} options={options} />
                <p>
                    Môn học có nhiều bài đăng nhất là <strong>{mostPostedSubject}</strong> với <strong>{maxPosts}</strong> bài đăng.
                    <br />
                    Môn học có ít bài đăng nhất là <strong>{leastPostedSubject}</strong> với <strong>{minPosts}</strong> bài đăng.
                </p>
        </div>
    );
};

SubjectPostsBarChart.propTypes = {
    postCounts: PropTypes.array.isRequired,
};

export default SubjectPostsBarChart;
