import { useNavigate } from "react-router-dom";
import "./navbar.css";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { data, error, loading } = useFetch(`users/${user?._id}`);
  console.log(data);
  const [openSettings, setOpenSettings] = useState(false);
  const [imgClass, setImgClass] = useState("profileImg");
  const handleSettings = (e) => {
    setOpenSettings(!openSettings);
    imgClass === "profileImg"
      ? setImgClass("profileImgWithSettings")
      : setImgClass("profileImg");
  };

  const handleLogout = async () => {
    const res = await axios.get("/auth/logout");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleViewProfile = () => {
    navigate(`/profile`);
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <span className="logo" onClick={() => navigate("/")}>
          My Nights
        </span>
        <div className="navItems">
          <div className="profile">
            <img
              className={imgClass}
              src={
                user?.img
                  ? `${process.env.PUBLIC_URL}/upload/profileImages/${user.img}`
                  : "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-18.jpg"
              }
              alt=""
              onClick={() => {
                handleSettings();
              }}
            />
            {openSettings && (
              <div className="settings">
                <div className="viewProfile" onClick={handleViewProfile}>
                  View Profile
                </div>
                <div className="logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
