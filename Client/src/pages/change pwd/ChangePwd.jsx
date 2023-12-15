import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./changePwd.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ChangePwd = () => {
  const { user, loading, error, dispatch } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: user?.username,
    password: undefined,
  });
  console.log(credentials);
  const navigate = useNavigate();
  console.log(user);

  const userRef = useRef();
  const errRef = useRef();

  const [errMsg, setErrMsg] = useState("");
  const [oldPwd, setOldPwd] = useState("");
  const [validOldPwd, setValidOldPwd] = useState(false);
  const [oldPwdFocus, setOldPwdFocus] = useState(false);

  const [newPwd, setNewPwd] = useState("");
  const [validNewPwd, setValidNewPwd] = useState(false);
  const [newPwdFocus, setNewPwdFocus] = useState(false);
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [wrongPwd, setWrongPwd] = useState(false);
  let wrongPwdMsg;
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    useRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(oldPwd);
    console.log(validOldPwd);
    oldPwd.length >= 4 ? setValidOldPwd(true) : setValidOldPwd(false);
  }, [oldPwd]);

  useEffect(() => {
    setValidNewPwd(PWD_REGEX.test(newPwd));
    setValidMatch(newPwd === matchPwd);
  }, [newPwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [oldPwd, newPwd, matchPwd]);

  useEffect(() => {
    setValidOldPwd(PWD_REGEX.test(oldPwd));
    //setWrongPwd(false);
    console.log(validOldPwd);
  }, [oldPwd]);

  useEffect(() => {
    errMsg === "Wrong Password !" ? setWrongPwd(true) : setWrongPwd(false);
    console.log(errMsg);
  }, [errMsg]);

  useEffect(() => {
    console.log(wrongPwd);
  }, [wrongPwd]);
  const handleChange = (e) => {
    if (e.target.id === "password") setOldPwd(e.target.value);
    else if (e.target.id === "newPwd") setNewPwd(e.target.value);
    else if (e.target.id === "confirmPwd") setMatchPwd(e.target.value);
    setSubmitting(false);
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    if (!validNewPwd && !validMatch) {
      if (!validNewPwd) setOldPwdFocus(true);
      if (!validMatch) setMatchFocus(true);
    } else {
      try {
        const updatedUser = {
          ...user,
          password: oldPwd,
          newPwd: newPwd,
        };
        console.log(updatedUser);
        const res = await axios.put(
          `/users/changePwd/${user._id}`,
          updatedUser
        );
        if (res.data) navigate("/profile");
      } catch (error) {
        setErrMsg(error?.response?.data?.message);
        console.log(error);
      }
    }
  };

  return (
    <div className="changePwd">
      <div className="changePwdContainer">
        {/* <h1>Welcome to My Nights</h1> */}
        <div className="labelInputWrapper">
          <label className="pwdLabel">
            Old Password:{" "}
            <FontAwesomeIcon
              icon={faCheck}
              className={validOldPwd && oldPwd && !wrongPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={
                (!validOldPwd && oldPwd) || wrongPwd ? "invalid" : "hide"
              }
            />
          </label>
          <input
            className="changePwdInput"
            type="password"
            placeholder="********"
            id="password"
            onChange={handleChange}
            autoComplete="off"
            required
            onFocus={() => setOldPwdFocus(true)}
            onBlur={() => setOldPwdFocus(false)}
            aria-invalid={validOldPwd ? "false" : "true"}
            aria-describedby="pwdnote"
          />
          {(submitting || wrongPwd) && (
            <p ref={errRef} className="inputErrMsg" aria-live="assertive">
              {submitting && oldPwd === "" ? "This field is required" : ""}
              {submitting && wrongPwd ? "Wrong Password" : ""}
            </p>
          )}
          <p
            id="pwdnote"
            className={
              oldPwdFocus && oldPwd && !validOldPwd
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
            {submitting && oldPwd === "" ? "This field is required" : ""}
          </p>
        </div>
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
        <div className="Btns">
          <button
            className="changePwdBtn"
            disabled={loading}
            onClick={handleClick}
          >
            Submit
          </button>
          <button
            className="changePwdBtn"
            disabled={loading}
            onClick={()=>navigate("/profile")}
          >
            Cancel
          </button>
        </div>
        {error && <span className="changePwdErrMsg">{error.message}</span>}
      </div>
    </div>
  );
};

export default ChangePwd;
