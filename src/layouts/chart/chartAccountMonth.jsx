import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyAccountChart = () => {
    const getMonths = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonthIndex = currentDate.getMonth();

        const months = [];

        for (let i = 0; i < 12; i++) {
            const monthIndex = (currentMonthIndex - i + 12) % 12;
            const year = currentMonthIndex - i < 0 ? currentYear - 1 : currentYear;
            const month = String(monthIndex + 1).padStart(2, '0');
            months.push(`${year}-${month}`);
        }

        return months.reverse();
    };

    const months = getMonths();
    const [filter, setFilter] = useState('3-months');
    const [apiData, setApiData] = useState(null);
    const [showInsight, setShowInsight] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                  `${import.meta.env.VITE_API_ENDPOINT}/api/statistics/?category=users`
                );
                const result = await response.json();
                setApiData(result.data.users_stat_by_roles);
            } catch (error) {
                console.error('Error fetching API data:', error);
            }
        };

        fetchData();
    }, []);

    const getFilteredData = () => {
        let filterMonths = [];
        let filterParentAccounts = [];
        let filterTutorAccounts = [];

        if (!apiData) return { filterMonths, filterParentAccounts, filterTutorAccounts };

        const monthCount = filter === '3-months' ? 3 : filter === '6-months' ? 6 : 12;
        filterMonths = months.slice(-monthCount);
        filterParentAccounts = filterMonths.map((month) => apiData[month]?.parent || 0);
        filterTutorAccounts = filterMonths.map((month) => apiData[month]?.tutor || 0);

        return { filterMonths, filterParentAccounts, filterTutorAccounts };
    };

    const { filterMonths, filterParentAccounts, filterTutorAccounts } = getFilteredData();

    const totalAccounts = filterParentAccounts.reduce((acc, val) => acc + val, 0) + filterTutorAccounts.reduce((acc, val) => acc + val, 0);

    const chartData = {
        labels: filterMonths,
        datasets: [
            {
                label: 'Tài khoản phụ huynh',
                data: filterParentAccounts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Tài khoản gia sư',
                data: filterTutorAccounts,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
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
                text: 'Số lượng tài khoản đăng ký theo tháng',
                font: {
                    size: 18,
                    weight: 'bold',
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thời gian',
                    font: {
                        weight: 'bold',
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Số lượng tài khoản',
                    font: {
                        weight: 'bold',
                    },
                },
                ticks: {
                    callback: function (value) {
                        return value % 1 === 0 ? value : '';
                    },
                },
            },
        },
    };

    // Calculate the most and least active months based on the selected time period
    const totalAccountsByMonth = filterParentAccounts.map((count, i) => count + filterTutorAccounts[i]);
    const maxAccounts = Math.max(...totalAccountsByMonth);
    const minAccounts = Math.min(...totalAccountsByMonth);
    const mostActiveMonth = filterMonths[totalAccountsByMonth.indexOf(maxAccounts)];
    const leastActiveMonth = filterMonths[totalAccountsByMonth.indexOf(minAccounts)];

    return (
        <div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setShowInsight(false); // Reset insight visibility when the filter changes
                    }}
                    style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        backgroundColor: '#f4f4f4',
                        color: '#333',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    className='focus:outline-none active:outline-none'
                >
                    <option value="3-months">Last 3 Months</option>
                    <option value="6-months">Last 6 Months</option>
                    <option value="1-year">Last 1 Year</option>
                </select>
                <div style={{ marginTop: '5px', fontSize: '14px' }}>
                    Tổng số tài khoản đã đăng ký: <strong>{totalAccounts}</strong>
                </div>
            </div>
            <Bar data={chartData} options={options} />
                <p style={{ marginTop: '1rem' }}>
                    Tháng có số lượng đăng ký nhiều nhất là <strong>{mostActiveMonth}</strong> với <strong>{maxAccounts}</strong> tài khoản đăng ký
                    <br />
                    Tháng có số lượng đăng ký ít nhất là <strong>{leastActiveMonth}</strong> với <strong>{minAccounts}</strong> tài khoản đăng ký.
                </p>
        
        </div>
    );
};

export default MonthlyAccountChart;
