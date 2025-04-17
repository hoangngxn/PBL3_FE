import { useEffect, useState } from "react";
import Panel from "../../layouts/panel/Panel";
import Pagination from "../../layouts/pagination/pagination";
import Admin from "../../layouts/PageAuthorization/admin/admin";
import axios from "axios";
import { useAppContext } from "../../AppProvider";
import DeleteAccount from "../../layouts/popup/DeleteAccount";
import TutorInfoPopup from "../../layouts/popup/TutorInfoPopup";

const TutorAccount = () => {
  const { sessionToken } = useAppContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const [tutors, setTutors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tutors.length / itemsPerPage);

  const currentTutors = tutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/api/tutors/`
        );
        setTutors(response.data);
      } catch (error) {
        console.error("Error fetching tutor data", error);
      }
    };

    fetchTutors();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedTutorId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedTutorId(null);
    setShowDeleteModal(false);
  };

  const handleDeleteTutor = async () => {
    if (!selectedTutorId) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/tutors/${selectedTutorId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi xóa tài khoản.");
      }

      const newTutors = tutors.filter(
        (tutor) => tutor.tutor_id !== selectedTutorId
      );
      setTutors(newTutors);
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting parent", error);
      alert("Có lỗi xảy ra khi xóa tài khoản.");
    }
  };

  const openInfoModal = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/tutors/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      setSelectedTutor(response.data);
      setShowInfoModal(true);
    } catch (error) {
      console.error("Error fetching tutor information", error);
      alert("Không thể tải thông tin gia sư.");
    }
  };

  const closeInfoModal = () => {
    setSelectedTutor(null);
    setShowInfoModal(false);
  };

  return (
    <Admin>
      <Panel activeItem={1}>
        <div className="relative h-[550px]">
          <div>
            <h2 className="text-xl font-bold mb-4">Quản lý tài khoản gia sư</h2>
            <table className="w-full border-collapse bg-white shadow-lg">
              <thead>
                <tr className="bg-custom_darkblue text-white">
                  <th className="border p-2">STT</th>
                  <th className="border p-2">Tên tài khoản</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentTutors.map((tutor, index) => (
                  <tr key={tutor.tutor_id} className="hover:bg-gray-100">
                    <td className="border p-2 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="border p-2 text-center">
                      {tutor.user.username}
                    </td>
                    <td className="border p-2 text-center">
                      {tutor.user.email}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-2 rounded mr-2"
                        onClick={() => openInfoModal(tutor.tutor_id)}
                      >
                        Xem thông tin
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                        onClick={() => openDeleteModal(tutor.tutor_id)}
                      >
                        Xóa tài khoản
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Popup for viewing tutor info */}
        <TutorInfoPopup
          isOpen={showInfoModal}
          onClose={closeInfoModal}
          tutor={selectedTutor}
        />

        {/* Popup delete */}
        <DeleteAccount
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteTutor}
        />
      </Panel>
    </Admin>
  );
};

export default TutorAccount;
