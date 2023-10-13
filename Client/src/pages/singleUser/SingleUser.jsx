import "./singleUser.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useState } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRef } from "react";
import { useEffect } from "react";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX =
  /^(?:\d{3}\s?\d{4}\s?\d{4}|\+\d{1,3}\s?\(\d{1,4}\)\s?\d{1,4}(?:[-\s]?\d{1,4})*|\d{10,})$/;
const CITY_REGEX = /^[A-Za-z\s\']*([A-Za-z][A-Za-z\s\']*){3,}$/;
const COUNTRY_REGEX = /^[A-Za-z\s\']*([A-Za-z][A-Za-z\s\']*){3,}$/;

const SingleUser = () => {
  const location = useLocation();
  const userId = location.pathname.split("/")[3];
  const { data: user, loading, error } = useFetch(`/users/${userId}`);
  const [sidebar, setSidebar] = useState(false);

  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [editMode, setEditMode] = useState(false);

  const userRef = useRef();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const [email, setEmail] = useState("");
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

  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [birthDate, setBirthDate] = useState(user.birthDate);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 16);
  const [age, setAge] = useState("");

  useEffect(() => {
    console.log(user);
    console.log(user.img);
    setEmail(user.email);
    setPhone(user.phone);
    setCountry(user.country);
    setCity(user.city);
    if (user.birthDate) setBirthDate(user.birthDate);
  }, [user]);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

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
    console.log(file);
  }, [file]);

  //calculate age
  useEffect(() => {
    if (birthDate) {
      const currentYear = new Date().getFullYear();
      const birthYear = new Date(birthDate).getFullYear();
      const calculatedAge = currentYear - birthYear;
      setAge(calculatedAge);
    }
    setInfo((prev) => ({ ...prev, age: age }));
  }, [birthDate]);

  //email or phone existed before
  useEffect(() => {
    errMsg === "Email Already exists"
      ? setEmailExists(true)
      : setEmailExists(false);
    if (errMsg === "Phone Already exists") {
      setPhoneExists(true);
      setValidPhone(false);
    } else setPhoneExists(false);
    console.log(errMsg, emailExists);
  }, [errMsg]);

  useEffect(() => {
    console.log(info);
  }, [info]);

  const handleChange = (e) => {
    if (e.target.id === "email") setEmail(e.target.value);
    else if (e.target.id === "phone") setPhone(e.target.value);
    else if (e.target.id === "city") setCity(e.target.value);
    else if (e.target.id === "country") setCountry(e.target.value);

    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleBirthDateChange = (date) => {
    setBirthDate(date);
    setInfo((prev) => ({ ...prev, birthDate: date }));
  };

  const handleRemoveImg = () => {
    setFile(false);
    user.img = undefined;
  };

  const handleSubmission = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    if (!(validEmail && validCity && validCountry && validPhone)) {
      if (!validEmail) setEmailFocus(true);
      if (!validCity) setCityFocus(true);
      if (!validCountry) setCountryFocus(true);
      if (!validPhone) setPhoneFocus(true);
    } else {
      try {
        console.log(file, file.name);

        const newUser = {
          ...user,
          ...info,
          img: file ? file.name : "",
        };
        const { username } = newUser;
        console.log(newUser);
        const res = await axios.put(`/users/${user._id}`, newUser);
        console.log(res);
        setEditMode(false);
      } catch (error) {
        setErrMsg(error.response.data.message);
        console.log(error);
      }
    }
  };

  return (
    <div className="single">
      <div className="wrapper">
        {sidebar && <Sidebar />}
        <div className="singleContainer">
          <div className="sideNavbars">
            <div className="sidebarBtn">
              <button onClick={() => setSidebar(!sidebar)}>
                <ListOutlinedIcon className="icon" />
              </button>
            </div>
            <NavbarAdmin />
          </div>
          {loading ? (
            "loading..."
          ) : error ? (
            error
          ) : !editMode ? (
            <div className="infoWrapper">
              <button className="editBtn" onClick={() => setEditMode(true)}>
                Edit
              </button>
              <h4 className="title">Information</h4>
              <div className="top">
                <div className="item">
                  <div className="itemImg">
                    <img
                      src={
                        user.img !== "" && user.img !== undefined
                          ? `${process.env.PUBLIC_URL}/upload/${user.img}`
                          : `https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg`
                      }
                      alt=""
                    />
                  </div>
                  <div className="details">
                    <h2 className="itemTitle">{user.username}</h2>
                    <div className="detailItem">
                      <span className="itemKey">Email:</span>
                      <span className="itemValue">{user.email}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Phone:</span>
                      <span className="itemValue">{user.phone}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Lives in:</span>
                      <span className="itemValue">
                        {(user.city, user.country)}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">age:</span>
                      <span className="itemValue">{age}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="infoWrapper">
              <h4 className="title">Information</h4>
              <div className="top">
                <div className="item">
                  <div className="itemImg">
                    <img
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : user.img !== undefined
                          ? `${process.env.PUBLIC_URL}/upload/${user.img}`
                          : `https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg`
                      }
                      alt=""
                    />
                    <label htmlFor="file" style={{ cursor: "pointer" }}>
                      <DriveFolderUploadOutlinedIcon className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                    <FontAwesomeIcon
                      className="removeImg"
                      icon={faCircleXmark}
                      onClick={handleRemoveImg}
                    />
                  </div>
                  <form>
                    <div className="eachInput">
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
                        value={email}
                        onChange={handleChange}
                        required
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
                    <div className="eachInput">
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
                        value={phone}
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
                    <div className="eachInput">
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
                        value={country}
                        required
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
                    <div className="eachInput">
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
                        value={city}
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
                    <div className="eachInput">
                      <label htmlFor="birthdate">Birthdate : </label>
                      <br />
                      <div className="birthDate" style={{ cursor: "pointer" }}>
                        <div>
                          <DatePicker
                            id="birthDate"
                            selected={birthDate ? new Date(birthDate) : minDate}
                            onChange={handleBirthDateChange}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select a birthdate"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            dropdownMode="select"
                            maxDate={minDate} // Set min date to 16 years ago
                          />
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
                      </div>
                    </div>
                    <button className="updateBtn" onClick={handleSubmission}>
                      Update
                    </button>
                    <button
                      className="cancelBtn"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
