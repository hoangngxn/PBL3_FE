import { useEffect, useState } from "react";
import Panel from "../../layouts/panel/Panel";
import Pagination from "../../layouts/pagination/pagination";
import Admin from "../../layouts/PageAuthorization/admin/admin";
import axios from "axios";
import { useAppContext } from "../../AppProvider";
import DeleteAccount from "../../layouts/popup/DeleteAccount";
import ParentInfoPopup from "../../layouts/popup/ParentInfoPopup";

const ParentAccount = () => {
  const { sessionToken } = useAppContext();

  const [parents, setParents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(parents.length / itemsPerPage);

  const currentParents = parents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchParents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/api/parents/`
        );
        setParents(response.data);
      } catch (error) {
        console.error("Error fetching parent data", error);
        setError("Không thể tải dữ liệu tài khoản phụ huynh.");
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedParentId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedParentId(null);
    setShowDeleteModal(false);
  };

  const handleDeleteParent = async () => {
    if (!selectedParentId) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/parents/${selectedParentId}/`,
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

      const newParents = parents.filter(
        (parent) => parent.parent_id !== selectedParentId
      );
      setParents(newParents);
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting parent", error);
      alert("Có lỗi xảy ra khi xóa tài khoản.");
    }
  };

  const openInfoModal = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/parents/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      setSelectedParent(response.data);
      setShowInfoModal(true);
    } catch (error) {
      console.error("Error fetching parent information", error);
      alert("Không thể tải thông tin phụ huynh.");
    }
  };

  const closeInfoModal = () => {
    setSelectedParent(null);
    setShowInfoModal(false);
  };

  return (
    <Admin>
      <Panel activeItem={2}>
        <div className="relative h-[550px]">
          <div>
            <h2 className="text-xl font-bold mb-4">
              Quản lý tài khoản phụ huynh
            </h2>
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
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
                  {currentParents.map((parent, index) => (
                    <tr key={parent.parent_id} className="hover:bg-gray-100">
                      <td className="border p-2 text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="border p-2 text-center">
                        {parent.user.username}
                      </td>
                      <td className="border p-2 text-center">
                        {parent.user.email}
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-2 rounded mr-2"
                          onClick={() => openInfoModal(parent.parent_id)}
                        >
                          Xem thông tin
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                          onClick={() => openDeleteModal(parent.parent_id)}
                        >
                          Xóa tài khoản
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <ParentInfoPopup
          isOpen={showInfoModal}
          onClose={closeInfoModal}
          parent={selectedParent}
        />

        <DeleteAccount
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteParent}
        />
      </Panel>
    </Admin>
  );
};

export default ParentAccount;
