import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";


import AppProvider from "./AppProvider";
import Footer from "./layouts/footer/Footer";
import Header from "./layouts/header/Header";
import VerifyEmail from "./pages/login/VerifyEmail";
import Register from "./pages/register/register";
import ForgotPasswordPage from "./pages/login/ForgotPasswordPage";
import CreateNewPassword from "./pages/login/CreateNewPassword";
import Login from "./pages/login/Login";
import Start from "./pages/start/Start";
import Panel from "./layouts/panel/Panel";
import PostApproval from "./pages/user/BaiDangDuocDuyet";
import PostManagement from "./pages/user/SuatDayDaGiao";
import DuyetBaiDang from "./pages/admin/DuyetBaiDang";
import TutorAccount from "./pages/admin/tutorAccount";
import ParentAccount from "./pages/admin/parentAccount";
import CreatePost from "./pages/user/CreatePost";
import UpdatePost from "./pages/user/UpdatePost";
import MainPageParent from "./pages/user/MainPageParent";
import MainPageTutor from "./pages/tutor/MainPageTutor";
import BaiDangChoDuyet from "./pages/user/BaiDangChoDuyet";
import ApprovedPost from "./pages/admin/ApprovedPost";
import TutorProfile from "./pages/tutor/tutorProfile";
import ParentProfile from "./pages/user/parentProfile";
import DetailPost from "./pages/user/DetailPost";
import TutorPassword from "./pages/tutor/tutorPassword";
import ParentPassword from "./pages/user/parentPassword";
import SuatDayDaDangKy from "./pages/tutor/SuatDayDaDangKy"
import SuatDayDaDuocNhan from "./pages/tutor/SuatDayDaDuocNhan";
import MyReviews from "./pages/tutor/MyReviews";
import ManageReport from "./pages/admin/ManageReport";
import StatisticalApp from "./pages/admin/statisticalApp";
import ChangePasswordNotify from "./pages/login/ChangePasswordNotify";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AppProvider>
      <ToastContainer />
      <div className="overflow-hidden">
        <Header setSearch={setSearchTerm} />
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/createNewPassword" element={<CreateNewPassword />} />
          <Route path="/changePasswordNotify" element={<ChangePasswordNotify />} />
          <Route path="/panel" element={<Panel />} />
          <Route path="/admin/tutor-account" element={<TutorAccount />} />
          <Route path="/admin/parent-account" element={<ParentAccount />} />
          <Route path="/admin/pending-posts" element={<DuyetBaiDang />} />
          <Route path="/admin/pending-posts/:postId" element={<DuyetBaiDang />} />
          <Route path="/admin/approved-posts/:postId" element={<ApprovedPost />} />
          <Route path="/admin/approved-posts" element={<ApprovedPost />} />
          <Route path="/admin/manage-report/" element={<ManageReport />} />
          <Route path="/admin/manage-report/:idReport" element={<ManageReport />} />
          <Route path="/admin/statistical" element={<StatisticalApp />} />

          <Route path="/parent/assigned" element={<PostManagement />} />
          <Route path="/parent/view-posts" element={<PostApproval />} />
          <Route path="/parent/pending-posts" element={<BaiDangChoDuyet />} />
          <Route path="/parent/create-post" element={<CreatePost />} />
          <Route path="/parent/update-post/:postId" element={<UpdatePost />} />
          <Route
            path="/parent/main-page"
            element={<MainPageParent searchTerm={searchTerm} />}
          />
          <Route path="/parent/profile" element={<ParentProfile />} />
          <Route path="/parent/detailPost/:idPost" element={<DetailPost />} />
          <Route path="/parent/information" element={<ParentPassword />} />
          <Route path="/parent/detailPost" element={<DetailPost />} />

          <Route
            path="/tutor/main-page"
            element={<MainPageTutor searchTerm={searchTerm} />}
          />
          <Route path="/tutor/profile" element={<TutorProfile />} />
          <Route path="/tutor/information" element={<TutorPassword />} />
          <Route path="/tutor/registered" element={<SuatDayDaDangKy />} />
          {/* /tutor/received-classes */}
          <Route path="/tutor/received-classes" element={<SuatDayDaDuocNhan />} />
          <Route path="/tutor/my-reviews" element={<MyReviews />} />
        </Routes>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
