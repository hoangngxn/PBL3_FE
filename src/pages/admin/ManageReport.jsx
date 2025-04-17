import { useEffect, useState } from "react";
import Page from "../../layouts/panel/Panel";
import Pagination from "../../layouts/pagination/pagination";
import Admin from "../../layouts/PageAuthorization/admin/admin";
import { useAppContext } from "../../AppProvider";
import ItemReport from "../../layouts/itemReport/ItemReport";
import { useParams } from "react-router-dom";

const ManageReport = () => {
  const [reportList, setReportList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const { sessionToken } = useAppContext();
  const [existReport, setExistReport] = useState(false);
  const itemsPerPage = 10;

  const { idReport } = useParams();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/api/report/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          setExistReport(true);
          if (idReport) {
            const report = data.find((report) => report.report_id === idReport);
            setReportList(report ? [report] : []);
            return;
          } else {
            setReportList(data);
          }
        } else {
          console.error("Failed to fetch report");
          setExistReport(false);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, [sessionToken, idReport]);

  const totalPages = Math.ceil(reportList.length / itemsPerPage);

  const currentPosts = reportList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Admin>
      <Page activeItem={6}>
        {existReport ? (
          <div className="relative max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4">
            <div className="font-bold text-lg">Danh sách báo cáo</div>
            {currentPosts.length > 0 ? (
              currentPosts.map((report) =>
                report && report.report_id ? (
                  <ItemReport key={report.report_id} report={report} />
                ) : (
                  <div
                    key={report ? report.id : Math.random()}
                    className="text-red-500"
                  >
                    Báo cáo không tồn tại
                  </div>
                )
              )
            ) : (
              <div className="text-red-500 text-center">Không có báo cáo nào</div>
            )}
          </div>
        ) : (
          <div className="text-center">Không có báo cáo nào</div>
        )}

        {reportList.length > 0 ? (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : null}
      </Page>
    </Admin>
  );
};

export default ManageReport;
