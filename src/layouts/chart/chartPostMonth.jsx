import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyPostChart = ({ data }) => {
    // Giả sử data là một mảng gồm các số lượng bài đăng theo từng tháng trong năm, ví dụ: [30, 45, 23, 50, ...]
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Số lượng bài đăng',
                data: data,  // Array số lượng bài đăng từng tháng
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Thống kê bài đăng theo tháng',
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};
MonthlyPostChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MonthlyPostChart;
