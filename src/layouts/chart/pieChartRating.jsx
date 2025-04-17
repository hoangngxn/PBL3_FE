import PropTypes from 'prop-types';
import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TutorRatingsPieChart = ({ data }) => {
    const [showInsight, setShowInsight] = useState(false);

    // Prepare data for the chart
    const chartData = {
        labels: ['0-1 Sao', '1-2 Sao', '2-3 Sao', '3-4 Sao', '4-5 Sao'],
        datasets: [
            {
                data: [
                    data['0-1'], // 0-1 stars
                    data['1-2'], // 1-2 stars
                    data['2-3'], // 2-3 stars
                    data['3-4'], // 3-4 stars
                    data['4-5'], // 4-5 stars
                ],
                backgroundColor: [
                    '#FF6384', // 0-1 stars
                    '#36A2EB', // 1-2 stars
                    '#FFCE56', // 2-3 stars
                    '#4BC0C0', // 3-4 stars
                    '#9966FF', // 4-5 stars
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                ],
            },
        ],
    };

    // Calculate the most and least rated star range
    const ratingsArray = [
        data['0-1'],
        data['1-2'],
        data['2-3'],
        data['3-4'],
        data['4-5'],
    ];
    const labels = ['0-1 Sao', '1-2 Sao', '2-3 Sao', '3-4 Sao', '4-5 Sao'];
    const maxRating = Math.max(...ratingsArray);
    const minRating = Math.min(...ratingsArray);
    const mostRated = labels[ratingsArray.indexOf(maxRating)];
    const leastRated = labels[ratingsArray.indexOf(minRating)];

    return (
        <div style={{ width: '90%', margin: '0 auto' }}>
            <h3 className='font-bold mb-3'>Thống kê sao trung bình gia sư</h3>
            <Pie data={chartData} />
                <p style={{ marginTop: '1rem' }}>
                    Khoảng sao được đánh giá nhiều nhất là <strong>{mostRated}</strong> với <strong>{maxRating}</strong> đánh giá.
                    <br />
                    Khoảng sao được đánh giá ít nhất là <strong>{leastRated}</strong> với <strong>{minRating}</strong> đánh giá.
                </p>

        </div>
    );
};

TutorRatingsPieChart.propTypes = {
    data: PropTypes.object.isRequired,
};

export default TutorRatingsPieChart;
