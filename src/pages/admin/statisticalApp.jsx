import { useEffect, useState } from "react";
import MonthlyAccountChart from "../../layouts/chart/chartAccountMonth";
import PostStatusBarChart from "../../layouts/chart/chartStatusPost";
import SubjectPostsBarChart from "../../layouts/chart/chartSubject";
import TutorRatingsPieChart from "../../layouts/chart/pieChartRating";
import StatsSection from "../../layouts/chart/StatsSection";
import Admin from "../../layouts/PageAuthorization/admin/admin";
import Page from "../../layouts/panel/Panel";

const StatisticalApp = () => {
    const [ratingsData, setRatingsData] = useState(null);

    useEffect(() => {
        const fetchRatingsData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/statistics/?category=classes`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched Data:', data); // Log the fetched data
                setRatingsData(data.data.tutors_stat_by_rating);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchRatingsData();
    }, []);

    const postData = { created: 150, approved: 120, rejected: 30, successfullyFound: 100 };

    return (
        <Admin>
            <Page activeItem={7}>
                <div>
                    <StatsSection />
                </div>
                <div className="mt-5">
                    <div className="flex gap-8">
                        <div className="w-[60%] bg-white p-3 shadow-lg rounded-lg px-6">
                            <SubjectPostsBarChart />
                        </div>
                        <div className="w-[38%] bg-white p-3 shadow-lg rounded-lg">
                            {ratingsData ? <TutorRatingsPieChart data={ratingsData} /> : <p>Loading...</p>}
                        </div>
                    </div>
                    <div className="flex gap-8 mt-8">
                        <div className="w-[50%] bg-white p-3 shadow-lg rounded-lg px-6">
                            <MonthlyAccountChart />
                        </div>
                        <div className="w-[48%] bg-white p-3 shadow-lg rounded-lg">
                            <PostStatusBarChart postData={postData} />
                        </div>
                    </div>
                </div>
            </Page>
        </Admin>
    );
};

export default StatisticalApp;
