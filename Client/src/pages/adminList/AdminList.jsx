import "./adminList.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import { useState } from "react";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";

const AdminList = ({ columns }) => {
  const [sidebar, setSidebar] = useState(false);
  if (!columns || columns.length === 0) {
    return null;
  }
  return (
    <div className="adminList">
      {sidebar && <Sidebar />}
      <div className="adminListContainer">
        <div className="sidebarWrapper">
          <div className="sidebarBtn">
            <button onClick={() => setSidebar(!sidebar)}>
              <ListOutlinedIcon className="icon" />
            </button>
          </div>
          <NavbarAdmin className="adminNavbar" />
        </div>
        <Datatable columns={columns} />
      </div>
    </div>
  );
};

export default AdminList;
