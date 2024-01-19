import "./newUser.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "../../axios";
import org_axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { AuthContext } from "../../context/AuthContext";

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX =
  /^(?:\d{3}\s?\d{4}\s?\d{4}|\+\d{1,3}\s?\(\d{1,4}\)\s?\d{1,4}(?:[-\s]?\d{1,4})*|\d{10,})$/;
const CITY_REGEX = /^[A-Za-z\s\']+$/;
const COUNTRY_REGEX = /^[A-Za-z\s\']+$/;
const AGE_REGEX = /^(?:[1-9]|[1-9][0-9]|1[0-4][0-9]|150)$/;

const NewUser = () => {
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});

  console.log(info);

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [email, setEmail] = useState(
    location.state ? location.state.Email : ""
  );
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [city, setCity] = useState("");
  const [validCity, setValidCity] = useState(false);
  const [cityFocus, setCityFocus] = useState(false);

  const [country, setCountry] = useState("");
  const [validCountry, setValidCountry] = useState(false);
  const [countryFocus, setCountryFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  console.log(errMsg);

  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);

  const [currImg, setCurrImg] = useState("");
  const [age, setAge] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 16);

  const [submitting, setSubmitting] = useState(false);
  const [excceded, setExceeded] = useState(false);
  const [uploading, setUploading] = useState(false);
  let imgRes;

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(validName);
    setValidName(USERNAME_REGEX.test(username));
  }, [username]);
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);
  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phone));
  }, [phone]);
  useEffect(() => {
    setValidCity(CITY_REGEX.test(city));
  }, [city]);
  useEffect(() => {
    setValidCountry(COUNTRY_REGEX.test(country));
  }, [country]);

  useEffect(() => {
    if (birthDate) {
      const currentYear = new Date().getFullYear();
      const birthYear = birthDate.getFullYear();
      const calculatedAge = currentYear - birthYear;
      setAge(calculatedAge);
    }
    setInfo((prev) => ({ ...prev, age: age }));
    setInfo((prev) => ({ ...prev, birthDate: birthDate }));
  }, [birthDate]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [username, pwd, matchPwd, email, phone, city, country, age]);

  useEffect(() => {
    if (errMsg === "Username Already exists") {
      setUsernameExists(true);
      setValidName(false);
    } else setUsernameExists(false);
    if (errMsg === "Email Already exists") {
      setEmailExists(true);
      setValidEmail(false);
    } else setEmailExists(false);
    if (errMsg === "Phone Already exists") {
      setPhoneExists(true);
      setValidPhone(false);
    } else setPhoneExists(false);
  }, [errMsg]);

  useEffect(() => {
    console.log(file);
    file.size > 1024 * 1024 ? setExceeded(true) : setExceeded(false);
  }, [file]);

  const handleChange = (e) => {
    if (e.target.id === "username") setUsername(e.target.value);
    else if (e.target.id === "password") setPwd(e.target.value);
    else if (e.target.id === "confirmPwd") setMatchPwd(e.target.value);
    else if (e.target.id === "email") setEmail(e.target.value);
    else if (e.target.id === "phone") setPhone(e.target.value);
    else if (e.target.id === "city") setCity(e.target.value);
    else if (e.target.id === "country") setCountry(e.target.value);
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleUpload = async () => {
    if (!excceded) {
      console.log("uploading....");
      try {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        const uploadRes = await org_axios.post(
          "https://api.cloudinary.com/v1_1/omarnasser/upload",
          data
        );
        setCurrImg(uploadRes?.data?.url);
        imgRes = uploadRes?.data?.url;
        console.log(uploadRes);
        console.log("uploaded successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    setUploading(true);
    setSubmitting(true);
    if (file) await handleUpload();
    try {
      const newUser = {
        ...info,
        img: currImg || imgRes,
        age: age,
      };
      console.log(newUser);
      const res = await axios.post("/auth/signup", newUser, {
        headers: { accessToken: accessToken },
      });
      console.log(res);
      if (res.data.success === false) {
        setErrMsg("Signup was not successful."); // Set an appropriate error message
      } else {
        navigate("/adminDashboard/users");
      }
      setUploading(false);
    } catch (error) {
      setErrMsg(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="new">
      {sidebar && <Sidebar />}
      <div className="newContainer">
        <div className="sidebarWrapper">
          <div className="sidebarBtn">
            <button className="listOutBtn" onClick={() => setSidebar(!sidebar)}>
              <ListOutlinedIcon className="icon" />
            </button>
          </div>
          <NavbarAdmin />
        </div>

        {uploading ? (
          <div className="uploading">
            <img
              className="uploadHotelIcon"
              src="https://media.tenor.com/hQz0Kl373E8AAAAj/loading-waiting.gif"
            />
            <label>adding User </label>
          </div>
        ) : (
          <>
            <div className="topUser">
              <h3>Add New User</h3>
            </div>
            <div className="bottomUser" style={{ height: "100vh" }}>
              <div className="left">
                <img
                  src={
                    file && !excceded
                      ? URL.createObjectURL(file)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                />
                <div className="upload">
                  <label htmlFor="file">
                    <DriveFolderUploadOutlinedIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
                {excceded && (
                  <div className="exceededMsg">
                    Please, select Img size less than 1 MB to be uploaded
                  </div>
                )}
              </div>
              <div className="right">
                <form action="">
                  <div className="formInput">
                    <label htmlFor="username">
                      Username :{" "}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validName ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={validName || !username ? "hide" : "invalid"}
                      />
                    </label>
                    <input
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
                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {usernameExists ? errMsg : ""}
                      {submitting && username === ""
                        ? "This field is required"
                        : ""}
                    </p>
                  </div>
                  <div className="formInput">
                    <label htmlFor="password">
                      Password :{" "}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validPwd ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={validPwd || !pwd ? "hide" : "invalid"}
                      />
                    </label>
                    <input
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
                        pwdFocus && pwd && !validPwd
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <br />
                      8 to 24 characters.
                      <br />
                      Must include uppercase and lowercase letters, a number and
                      a special character.
                      <br />
                      Allowed special characters:{" "}
                      <span aria-label="exclamation mark">!</span>{" "}
                      <span aria-label="at symbol">@</span>{" "}
                      <span aria-label="hashtag">#</span>{" "}
                      <span aria-label="dollar sign">$</span>{" "}
                      <span aria-label="percent">%</span>
                    </p>

                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {submitting && pwd === "" ? "This field is required" : ""}
                    </p>
                  </div>
                  <div className="formInput">
                    <label htmlFor="confirmPwd">
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
                      type="password"
                      id="confirmPwd"
                      placeholder="********"
                      onChange={handleChange}
                      required
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                    />
                    <p
                      id="confirmnote"
                      className={
                        matchFocus && matchPwd && !validMatch
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <br />
                      Must match the first password input field.
                    </p>
                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {!validMatch && !matchFocus
                        ? "password doesn't match"
                        : ""}
                      {submitting && matchPwd === ""
                        ? "This field is required"
                        : ""}
                    </p>
                  </div>
                  <div className="formInput">
                    <label htmlFor="email">
                      Email :{" "}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validEmail && email ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={!validEmail && email ? "invalid" : "hide"}
                      />
                    </label>
                    <input
                      type="email"
                      id="email"
                      onChange={handleChange}
                      defaultValue={email}
                      required
                      placeholder="khalid@example.com"
                      aria-invalid={validEmail ? "false" : "true"}
                      //aria-describedby="confirmnote"
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                    />
                    <p
                      id="confirmnote"
                      className={
                        emailFocus && email && !validEmail
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <br />
                      please, enter valid email such as:
                      <br />
                      example@mail.com
                    </p>
                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {emailExists ? errMsg : ""}
                      {submitting && email === ""
                        ? "This field is required"
                        : ""}
                    </p>
                  </div>
                  <div className="formInput">
                    <label htmlFor="phone">
                      Phone :{" "}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validPhone && phone ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={!validPhone && phone ? "invalid" : "hide"}
                      />
                    </label>
                    <input
                      type="text"
                      id="phone"
                      onChange={handleChange}
                      required
                      placeholder="012 5665 5648"
                      aria-invalid={validPhone ? "false" : "true"}
                      aria-describedby="phonenote"
                      onFocus={() => setPhoneFocus(true)}
                      onBlur={() => setPhoneFocus(false)}
                    />
                    <p
                      id="phonenote"
                      className={
                        phoneFocus && phone && !validPhone
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <br />
                      please, enter valid phone like this:
                      <br />
                      012 5665 5648
                    </p>
                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {phoneExists ? errMsg : ""}

                      {submitting && phone === ""
                        ? "This field is required"
                        : ""}
                    </p>
                  </div>
                  <div className="formInput">
                    <label htmlFor="country">
                      Country :{" "}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validCountry && country ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          !validCountry && country ? "invalid" : "hide"
                        }
                      />
                    </label>
                    <input
                      type="text"
                      id="country"
                      onChange={handleChange}
                      required
                      placeholder="USA"
                      aria-invalid={validCountry ? "false" : "true"}
                      aria-describedby="countrynote"
                      onFocus={() => setCountryFocus(true)}
                      onBlur={() => setCountryFocus(false)}
                    />
                    <p
                      id="countrynote"
                      className={
                        countryFocus && country && !validCountry
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <br />
                      please, enter valid country name
                    </p>
                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {submitting && country === ""
                        ? "This field is required"
                        : ""}
                    </p>
                  </div>
                  <div className="formInput">
                    <label htmlFor="city">
                      City :{" "}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validCity && city ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={!validCity && city ? "invalid" : "hide"}
                      />
                    </label>
                    <input
                      type="text"
                      id="city"
                      onChange={handleChange}
                      required
                      placeholder="New York"
                      aria-invalid={validCity ? "false" : "true"}
                      aria-describedby="citynote"
                      onFocus={() => setCityFocus(true)}
                      onBlur={() => setCityFocus(false)}
                    />
                    <p
                      id="citynote"
                      className={
                        cityFocus && city && !validCity
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <br />
                      please, enter valid city name
                    </p>
                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {submitting && city === ""
                        ? "This field is required"
                        : ""}
                    </p>
                  </div>
                  <div className="birthDate">
                    <label htmlFor="birthdate">Birthdate : </label>
                    <br />
                    <div
                      className=""
                      style={{ cursor: "pointer", width: "100%" }}
                    >
                      <DatePicker
                        selected={birthDate}
                        onChange={(date) => setBirthDate(date)}
                        dateFormat="MM/dd/yyyy"
                        placeholderText="Select a birthdate"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        dropdownMode="select"
                        maxDate={minDate} // Set min date to 16 years ago
                      />
                      <br />
                    </div>
                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {submitting && birthDate === null
                        ? "This field is required"
                        : ""}
                    </p>
                  </div>
                  <br />
                  <button className="submitBtn" onClick={handleClick}>
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewUser;
