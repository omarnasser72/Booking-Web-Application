import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./newPwd.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const NewPwd = () => {
  const navigate = useNavigate();

  const errRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const [newPwd, setNewPwd] = useState("");
  const [validNewPwd, setValidNewPwd] = useState(false);
  const [newPwdFocus, setNewPwdFocus] = useState(false);
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [userId, setUserId] = useState();

  // Get the current URL
  const currentUrl = window.location.href;
  console.log(currentUrl);

  // Create a URL object
  const urlObject = new URL(currentUrl);
  console.log(urlObject);
  // Get the value of the 'token' parameter
  const token = urlObject.href.split("token=")[1];

  console.log(token);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await axios.get(`/auth/getUserInfo?token=${token}`);
        console.log(res);
        setUserId(res.data);
      } catch (err) {
        setError(err);
        console.log(err);
      }
    };
    if (token) getUserId();
  }, [token]);

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  useEffect(() => {
    useRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidNewPwd(PWD_REGEX.test(newPwd));
    setValidMatch(newPwd === matchPwd);
  }, [newPwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [newPwd, matchPwd]);

  const handleChange = (e) => {
    if (e.target.id === "newPwd") setNewPwd(e.target.value);
    else if (e.target.id === "confirmPwd") setMatchPwd(e.target.value);
    setSubmitting(false);
  };

  const handleClick = async (e) => {
    setLoading(true);
    setSubmitting(true);
    e.preventDefault();
    if (!validNewPwd && !validMatch) {
      if (!validNewPwd) setNewPwdFocus(true);
      if (!validMatch) setMatchFocus(true);
    } else {
      try {
        const updatedUser = {
          newPwd: newPwd,
        };
        console.log(updatedUser);
        const res = await axios.put(`/users/newPwd/${userId}`, updatedUser);
        if (res.data) navigate("/login");
      } catch (err) {
        setError(err);
        setErrMsg(err?.response?.data?.message);
        console.log(err);
      }
    }
  };

  return (
    <div className="changePwd">
      <div className="changePwdContainer">
        {/* <h1>Welcome to My Nights</h1> */}
        <div className="labelInputWrapper">
          <label className="pwdLabel">
            New Password:{" "}
            <FontAwesomeIcon
              icon={faCheck}
              className={validNewPwd && newPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={!validNewPwd && newPwd ? "invalid" : "hide"}
            />
          </label>
          <input
            className="changePwdInput"
            type="password"
            placeholder="********"
            id="newPwd"
            onChange={handleChange}
            autoComplete="off"
            required
            onFocus={() => setNewPwdFocus(true)}
            onBlur={() => setNewPwdFocus(false)}
            aria-invalid={validNewPwd ? "false" : "true"}
            aria-describedby="pwdnote"
          />
          <p
            id="pwdnote"
            className={
              newPwdFocus && newPwd && !validNewPwd
                ? "instructions"
                : "offscreen"
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
            {submitting && newPwd === "" ? "This field is required" : ""}
          </p>
        </div>
        <div className="labelInputWrapper">
          <label className="pwdLabel">
            Confirm Password:{" "}
            <FontAwesomeIcon
              icon={faCheck}
              className={validMatch && matchPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={!validMatch && matchPwd ? "invalid" : "hide"}
            />
          </label>
          <input
            className="changePwdInput"
            type="password"
            placeholder="********"
            id="confirmPwd"
            onChange={handleChange}
            autoComplete="off"
            required
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="pwdnote"
          />
          <p
            id="pwdnote"
            className={
              matchFocus && matchPwd && !validMatch
                ? "instructions"
                : "offscreen"
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
            {submitting && matchPwd === "" ? "This field is required" : ""}
          </p>
        </div>
        <div className="submitBtn">
          <button
            className="changePwdBtn"
            disabled={loading || !userId}
            onClick={handleClick}
          >
            Submit
          </button>
        </div>
        {error && <span className="changePwdErrMsg">{error}</span>}
      </div>
    </div>
  );
};

export default NewPwd;
