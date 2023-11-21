import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./resetPwd.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ResetPwd = () => {
  const navigate = useNavigate();

  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [sentPwd, setSentPwd] = useState(false);

  useEffect(() => {
    useRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(email);
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  const handleChange = (e) => {
    if (e.target.id === "email") setEmail(e.target.value);
  };

  const handleClick = async (e) => {
    setLoading(true);
    setSubmitting(true);
    e.preventDefault();
    if (!validEmail) {
      setEmailFocus(true);
    } else {
      console.log(email);
      const emailCorrectFormat = {
        email: email,
      };
      try {
        const res = await axios.post("/auth/resetPwd", emailCorrectFormat);
        console.log(res);
        if (res.data) navigate("/login");
        else {
          setSentPwd(true);
        }
      } catch (err) {
        console.log(err);
        setError(err);
      }
    }
  };
  return (
    <div className="login">
      <div className="loginContainer">
        <h1>Welcome to My Nights</h1>
        {email && (
          <p id="uidnote">
            {emailFocus && (
              <>
                {!validEmail ? (
                  <FontAwesomeIcon icon={faTimes} className="invalidIcon" />
                ) : (
                  <FontAwesomeIcon icon={faCheck} className="validIcon" />
                )}
              </>
            )}
          </p>
        )}
        <input
          className="loginInput"
          type="text"
          placeholder="email"
          id="email"
          value={email}
          onChange={handleChange}
          autoComplete="off"
          required
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
          aria-invalid={validEmail ? "false" : "true"}
          aria-describedby="uidnote"
        />
        <p ref={errRef} className="inputErrMsg" aria-live="assertive">
          {submitting && email === "" ? "This field is required" : ""}
        </p>

        <button
          className="loginBtn"
          onClick={handleClick}
          disabled={loading || error}
        >
          {!sentPwd ? "Reset Password" : "Resend"}
        </button>
      </div>
    </div>
  );
};

export default ResetPwd;
