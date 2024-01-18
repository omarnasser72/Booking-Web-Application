import { Sidebar } from "../../components/sidebar/Sidebar";
import { NavbarAdmin } from "../../components/navbarAdmin/NavbarAdmin";
import "./adminHome.scss";
import Widget from "../../components/widget/Widget";
import List from "../../components/table/Table";
import { useEffect, useState } from "react";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

const AdminHome = () => {
  const [sidebar, setSidebar] = useState(false);

  // useEffect(() => {
  //   // Check if the page needs to be reloaded
  //   const needsReload = localStorage.getItem("needsReload");
  //   if (needsReload) {
  //     // Perform the reload
  //     window.location.reload();

  //     // Reset the flag to prevent further reloading
  //     localStorage.removeItem("needsReload");
  //   }
  // }, []);

  return (
    <div className="adminHome">
      {sidebar && <Sidebar />}
      <div className="adminHomeContainer">
        <div className="sidebarWrapper">
          <div className="sidebarBtn">
            <button onClick={() => setSidebar(!sidebar)}>
              <ListOutlinedIcon className="icon" />
            </button>
          </div>
          <NavbarAdmin className="navbar" />
        </div>
        <div className="widgetContainer">
          <Widget type="user" />
          <Widget type="hotels" />
          <Widget type="rooms" />
          <Widget type="reservations" />
        </div>
        <div className="adminListContainer">
          <div className="listTitle">Latest Reservations</div>
          <List />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
