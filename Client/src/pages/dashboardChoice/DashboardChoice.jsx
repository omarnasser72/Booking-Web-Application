import { useNavigate } from "react-router-dom";
import "./dashboardChoice.css";

const Login = () => {
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

export default Login;
