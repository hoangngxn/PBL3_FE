import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import User from "../../assets/image/User.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import {
  faMagnifyingGlass,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/image/coloredlogo.png";
import LogoLogin from "../../assets/image/whitelogo.png";
import PropTypes from "prop-types";
import NotifyAdmin from "../notify/NotifyAdmin";
import NotifyParent from "../notify/NotifyParent";
import NotifyTutor from "../notify/NotifyTutor";

const Header = ({ setSearch }) => {
  let navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const { sessionToken, setSessionToken, setRole, setId, role, id, name } =
    useAppContext();
  const rolePath = role === "parent" ? "parent" : "tutor";
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (sessionToken) {
      setActiveLink("main-page");
    }
  }, [sessionToken]);

  useEffect(() => {
    if (role !== "admin") {
      const fetchData = async () => {
        try {
          const url = `${import.meta.env.VITE_API_ENDPOINT}/api/${role === "tutor" ? "tutors" : "parents"
            }/${id}`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (response.ok) {
            setAvatar(data.avatar);
          } else {
            localStorage.clear()

          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/logout/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setSessionToken("");
        setRole("");
        setId("");
        setSearch("");
        setShowDropdown(false);
        localStorage.removeItem("refreshToken");
        navigate("/");
      } else {
        console.error("Logout failed!");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = (query) => {
    setSearch(query);
  };

  const avatarUrl = avatar && avatar !== "Not recorded"
    ? `${import.meta.env.VITE_API_ENDPOINT}${avatar}`
    : User;

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const handleInputChange = (e) => {
    const query = e.target.value;
    debouncedHandleSearch(query);
  };

  return (
    <>
      {sessionToken ? (
        <div>
          {role === "admin" ? (
            <div className="h-[12vh] w-screen px-28 flex items-center justify-between bg-custom_darkblue">
              <div className="flex items-center gap-32">
                <div
                  id="logo-header"
                  onClick={() => navigate("/admin/approved-posts")}
                >
                  <img
                    src={LogoLogin}
                    alt="Logo"
                    className="h-10 mb-2 bg-center object-cover cursor-pointer"
                  />
                </div>
                <div
                  className=" text-white mx-6 cursor-pointer transition duration-200 underline underline-offset-4 font-semibold"
                  onClick={() => navigate("/admin/approved-posts")}
                >
                  Quản lý Admin
                </div>
              </div>
              <div className="flex text-white items-center cursor-pointer text-[1.1rem] gap-10">
                <NotifyAdmin />
                <div className="relative flex items-center gap-2">
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <p className="font-semibold">{name}</p>
                  <i
                    className={`fas ${
                      showDropdown ? "fa-chevron-up" : "fa-chevron-down"
                    } text-[0.8rem] ml-1`}
                    onClick={() => setShowDropdown(!showDropdown)}
                  ></i>
                  {showDropdown && (
                    <div
                      className="bg-white text-black text-[0.9rem] absolute flex items-center p-2 rounded-md -right-12 top-10 shadow-md border border-slate-200 hover:bg-slate-100"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      <p className="ml-2">Đăng xuất</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[12vh] w-screen px-28 flex items-center justify-between bg-custom_darkblue">
              <div
                id="logo-header"
                onClick={() => {
                  if (role === "tutor") {
                    navigate("/tutor/main-page", { replace: true });
                  } else if (role === "parent") {
                    navigate("/parent/main-page", { replace: true });
                  }
                  setTimeout(() => {
                    window.location.reload();
                  }, 0);
                }}
              >
                <img
                  src={LogoLogin}
                  alt="Logo"
                  className="h-10 mb-2 bg-center object-cover cursor-pointer"
                />
              </div>
              <div className="">
                <ul className="flex text-white text-[1.1rem]">
                  {["main-page", "information"].map((path) => (
                    <Link
                      key={path}
                      to={`${rolePath}/${path}`}
                      className={`font-semibold mx-6 cursor-pointer transition duration-200 
                    ${
                      activeLink === path
                        ? "underline underline-offset-4"
                        : "hover:scale-110"
                    }`}
                      onClick={() => setActiveLink(path)}
                    >
                      {path === "main-page" ? "Trang chủ" : "Hồ sơ cá nhân"}
                    </Link>
                  ))}
                </ul>
              </div>
              <div
                id="search-header"
                className="bg-white/50 py-2 w-[25%] relative pl-4 pr-8 rounded-xl"
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="w-full text-white bg-transparent border-none outline-none placeholder:text-white"
                  id="search_input"
                  name="search"
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <FontAwesomeIcon
                  id="search-but"
                  icon={faMagnifyingGlass}
                  className="text-white absolute right-3 top-3"
                />
              </div>
              {role === "parent" && <NotifyParent />}
              {role === "tutor" && <NotifyTutor />}

              <div className="flex text-white items-center cursor-pointer text-[1.1rem]">
                <div className="relative flex items-center gap-2">
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <p className="font-semibold">{name}</p>
                  <i
                    className={`fas ${
                      showDropdown ? "fa-chevron-up" : "fa-chevron-down"
                    } text-[0.8rem] ml-1`}
                    onClick={() => setShowDropdown(!showDropdown)}
                  ></i>
                  {showDropdown && (
                    <div
                      className="bg-white text-black text-[0.9rem] absolute flex items-center p-2 rounded-md -right-12 top-10 shadow-md border border-slate-200 hover:bg-slate-100"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      <p className="ml-2">Đăng xuất</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[12vh] w-screen px-28 flex items-center justify-between">
          <div id="logo-header">
            <Link to="/">
              <img
                src={Logo}
                alt="Logo"
                className="h-10 mb-2 bg-center object-cover cursor-pointer"
              />
            </Link>
          </div>
          <div className="">
            <ul className="flex">
              <li className="font-semibold mx-6 cursor-pointer">
                <Link to="/">GIỚI THIỆU</Link>
              </li>
              <li className="font-semibold mx-6 cursor-pointer">
                <a href="#contact">LIÊN HỆ</a>
              </li>
            </ul>
          </div>
          <div className="">
            <button
              className="bg-custom_yellow px-4 py-2 font-semibold rounded-md border border-black"
              onClick={() => navigate(`/login`)}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      )}
    </>
  );
};

Header.propTypes = {
  setSearch: PropTypes.func.isRequired,
};

export default Header;
