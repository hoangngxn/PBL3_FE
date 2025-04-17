import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchEnumData, getEnumData } from "./assets/data/enum";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default function AppProvider({
  children,
  initialSessionToken,
  initialRole,
  initialId,
  initialName
}) {
  const [id, setId] = useState(() => {
    return initialId || localStorage.getItem("id");
  });
  const [role, setRole] = useState(() => {
    return initialRole || localStorage.getItem("role");
  });

  const [sessionToken, setSessionToken] = useState(() => {
    return initialSessionToken || localStorage.getItem("accessToken") || "";
  });

  const [name, setName] = useState(() => {
    return initialName || localStorage.getItem("name") || "";
  });


  const localDataEnum = {
    classes: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
    ],
    fees: [
      "Dưới 20.000đ",
      "20.000đ - 70.000đ",
      "70.000đ - 120.000đ",
      "120.000đ - 170.000đ",
      "170.000đ - 220.000đ",
      "220.000đ - 250.000đ",
      "Trên 250.000đ",
    ],
    students: ["Dưới 10 học viên", "10-20 học viên", "Trên 20 học viên"],
    sessions: [
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
      "Chủ nhật",
    ],
  };

  const [dataEnum, setDataEnum] = useState(localDataEnum);

  useEffect(() => {
    const loadData = async () => {
      await fetchEnumData();
      const apiData = getEnumData();

      if (apiData) {
        setDataEnum((prevData) => ({
          ...prevData,
          ...apiData,
        }));
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (sessionToken && role) {
      localStorage.setItem("role", role);
      localStorage.setItem("accessToken", sessionToken);
      localStorage.setItem("id", id);
      localStorage.setItem("name", name)
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("name")
    }
  }, [sessionToken, role, id, name]);

  return (
    <AppContext.Provider
      value={{
        sessionToken,
        setSessionToken,
        role,
        setRole,
        id,
        setId,
        dataEnum,
        name,
        setName
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node,
  initialSessionToken: PropTypes.string,
  initialRole: PropTypes.string,
  initialId: PropTypes.string,
  initialName: PropTypes.string
};
