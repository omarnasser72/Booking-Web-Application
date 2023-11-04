import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./verifyEmail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const url = window.location.href;
  const urlObject = new URL(url);
  console.log(urlObject);

  const pendingUserId = urlObject.href.split("id=")[1];
  console.log(pendingUserId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/auth/pendingUser/${pendingUserId}`);
        if (res?.data) {
          setEmail(res.data?.email);
        }
      } catch (err) {
        setError(err);
        console.log(err);
      }
    };

    fetchData();
  }, [pendingUserId]);

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.delete(`/auth/verifyEmail/${email}`);
      console.log(res);
      if (res?.data) {
        Swal.fire({
          position: "middlw",
          icon: "success",
          title: `${email} has deleted successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      setError(error?.message);
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="VerifyEmail">
      <h1>Welcome to My Nights</h1>
      <div className="emailBtnWrapper">
        {email && <p className="emailSec">{email}</p>}
        <button className="verifyBtn" disabled={loading} onClick={handleClick}>
          Verify Email
        </button>
      </div>
      {error && <span className="logInErrMsg">{error.message}</span>}
    </div>
  );
};

export default VerifyEmail;
