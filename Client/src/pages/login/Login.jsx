import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../axios";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  console.log(credentials);
  const { user, loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(user);

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    useRef.current?.focus();
    localStorage.setItem("needsReload", "true");
  }, []);

  useEffect(() => {
    console.log(validName);
    setValidName(USERNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    console.log(validPwd);
    setValidPwd(PWD_REGEX.test(pwd));
  }, [pwd]);

  const handleChange = (e) => {
    if (e.target.id === "username") setUsername(e.target.value);
    else if (e.target.id === "password") setPwd(e.target.value);
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    if (!(validName && validPwd)) {
      if (!validName) setUsernameFocus(true);
      if (!validPwd) setPwdFocus(true);
    } else {
      dispatch({ type: "LOGIN_START" });
      try {
        const res = await axios.post(`/auth/login`, credentials);
        const decoded = jwtDecode(res?.data?.accessToken);
        console.log(decoded);
        if (decoded) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: res.data.details,
            accessToken: res.data.accessToken,
          });
          decoded.isAdmin === true
            ? navigate("/dashboardChoice")
            : navigate("/");
        } else {
          dispatch({
            type: "LOGIN_FALIURE",
            payload: { message: "You're not authorized" },
          });
        }
      } catch (error) {
        console.log(error);
        dispatch({ type: "LOGIN_FALIURE", payload: error.response.data });
      }
    }
  };
  console.log(user);
  return (
    <div className="login">
      <div className="loginContainer">
        <h1>Welcome to My Nights</h1>
        <input
          className="loginInput"
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          autoComplete="off"
          required
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
          aria-invalid={validName ? "false" : "true"}
          aria-describedby="uidnote"
        />
        <p
          id="uidnote"
          className={
            usernameFocus && username && !validName
              ? "instructions"
              : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          <br />
          4 to 24 characters.
          <br />
          Must begin with a letter.
          <br />
          Letters, numbers, underscores, hyphens allowed.
        </p>
        <p ref={errRef} className="inputErrMsg" aria-live="assertive">
          {submitting && username === "" ? "This field is required" : ""}
        </p>
        <input
          className="loginInput"
          type="password"
          placeholder="********"
          id="password"
          onChange={handleChange}
          autoComplete="off"
          required
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
        />
        <p
          id="pwdnote"
          className={
            pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          <br />
          8 to 24 characters.
          <br />
          Must include uppercase and <br />
          lowercase letters, a number and
          <br /> a special character.
          <br />
          Allowed special characters:{" "}
          <span aria-label="exclamation mark">!</span>{" "}
          <span aria-label="at symbol">@</span>{" "}
          <span aria-label="hashtag">#</span>{" "}
          <span aria-label="dollar sign">$</span>{" "}
          <span aria-label="percent">%</span>
        </p>
        <p ref={errRef} className="inputErrMsg" aria-live="assertive">
          {submitting && pwd === "" ? "This field is required" : ""}
        </p>
        <button className="loginBtn" disabled={loading} onClick={handleClick}>
          Login
        </button>
        {error && <span className="logInErrMsg">{error.message}</span>}
        <div className="registerNow">
          <pre>
            you don't have account ?{" "}
            <p
              onClick={() => {
                navigate("/register");
              }}
            >
              {" "}
              sign up{" "}
            </p>{" "}
            Now!
          </pre>
          <pre
            onClick={() => {
              navigate("/resetPassword");
            }}
          >
            <p>forget password</p>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Login;
