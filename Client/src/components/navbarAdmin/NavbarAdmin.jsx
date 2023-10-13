import "./navbarAdmin.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const NavbarAdmin = () => {
  const { user, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="adminNavbar">
      {error ? (
        <div className="errorOrLoadingMsg">{error}</div>
      ) : loading ? (
        <div className="errorOrLoadingMsg">{loading}</div>
      ) : (
        <div className="wrapper">
          {/* <div className="search">
            <input type="text" placeholder="Search..." />
            <SearchOutlinedIcon className="icon" />
          </div> */}
          <div className="items">
            {/* <div className="item">
              <NotificationsNoneOutlinedIcon className="icon" />
              <div className="counter">1</div>
            </div>
            <div className="item">
              <ChatBubbleOutlineOutlinedIcon className="icon" />
              <div className="counter">1</div>
            </div> */}

            <div className="item">
              <img
                src={
                  user?.img
                    ? user.img.includes("http")
                      ? user.img
                      : `${process.env.PUBLIC_URL}/upload/profileImages/${user.img}`
                    : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8ODw4NDg0QDw4ODQ0NDg0NDg8NDQ4NFREWFhURFRMYHSggGBolGxUTITEhJSkrLi4uGB8zODMtNygtLisBCgoKDQ0NDg0NDzcZFRk3KysrKy0rNysrKysrLSsrKysrKys3KysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAaAAEBAAMBAQAAAAAAAAAAAAAAAwECBQQH/8QAMhABAAIAAwUFBgYDAAAAAAAAAAECAwQRITFRUpESE0FhcQUUMqHR8CJCcoGx4TOSwf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A+4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATIA0nEhrN5BUR7U8WNQXENWe1PFRYSi8toxEG4xEsgAAAAAAAAAAAAAAAADFp0StbUG1sTg0mQVAAAAAAAABvW/FoAtEsoxOilbaorYAAAAAAAAAAABi1tCZSmdQYmQFQAAAAHlxs7EbK/inj4f281s5efHT0iBXTHLjN4nN1iFsLPeFo/ePoGPcMVtExrE6x5MiAAAAK0tq2QiVqzqisgAAAAAAAA1tOkA0vZqCoAAAAOfncxrM0rujfPGeD15nE7NJnx3R6y5IoAigAK5fHmk+U74+/F1azExExunbDivf7OxNYmvDbHpIj2AKgAAzS2jAC41pOxsigAAAAACeJKiMyDACoAAAA8vtH4Y/XH8S5zp56utJ8pifvq5iLAAUAAer2d8c/pn+YeV7fZtdtreUR/0R7gFQAAABtSdqqC8IoAAAAADEoq33SkIAKAAAAMTGuxysxhdi2nh4Txh1mmLhRaNJ/uBXHF8bKWrujtRxj6IIoCmFgWtuj952QDStZmYiI1mXWwMPsVivWeMtMvl4p524/RcQAVAAAABWm6ElcPcitgAAAAAa33SktKIgAoAAAxa0RtmdI8wZHlxM9WPhibfKHnvnbzu0j0jWfmK6TW1InfWJ9Y1cqce877z10aTaZ8Z6yg7EYVY3Vj/AFbOLrPGerMYlo3WnrIY7I5Vc1ePza+u1amfn81YnzjYo94jhZmlt06TwnZKwgAAAArh7klaboRWwAAAAACErpYkbQagKgCOaxuxXXxnZHrxBrmc1FNkbbfKPVzsTEm062nVrMiNAAAAAAAAD04Gbmuy34q/OHmAdqtomImJ1ifFlzcljdm3ZndaekukrIAAtCdI2qooAAAAAA1vGsNgEBm8aSwqDne0La304RHz+4dFy87/AJLft/ECxABFAAAAAAAAAAHapbWInjES4rr5b4K/pgSqAzWNVRvhw3BFAAAAAAAAYtGqMwu1vXUEmlsOs7ZrEzxmG8ion3NOSvSDuaclekKAJ9xTkr0g7inJXpCgCfcU5K9IO4pyV6QoAl3FOSvQ93pyR0VAT7inJHQ7inJHRQBP3enJHQ93pyR0UAS93pyR0UiGQBWldGKVbooAAAAAAAAAAADW1dUpjRdiY1BEb2o0VAAAAAAAAAG1aSDWIUrTRtFdGUUAAAAAAAAAAAAAAAAYmsSyAnOHwazSVgEBdjQERbRkEYrPBtGHxUAYisQyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k="
                }
                alt=""
                className="avatar"
                onClick={() => {
                  navigate(`/adminDashboard/adminProfile`);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarAdmin;
