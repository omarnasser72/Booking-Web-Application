import { useNavigate } from "react-router-dom";
import "./dashboardChoice.css";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    // Check if the page needs to be reloaded
    const needsReload = localStorage.getItem("needsReload");
    if (needsReload) {
      // Perform the reload
      window.location.reload();

      // Reset the flag to prevent further reloading
      localStorage.removeItem("needsReload");
    }
  }, []);
  return (
    <div className="dashboardChoice">
      <button
        className="choiceBtn"
        onClick={() => (window.location.href = "#/adminDashboard")}
      >
        Admin Dashboard
      </button>
      <button
        className="choiceBtn"
        onClick={() => (window.location.href = "/")}
      >
        User Dashboard
      </button>
    </div>
  );
};

export default Dashboard;
