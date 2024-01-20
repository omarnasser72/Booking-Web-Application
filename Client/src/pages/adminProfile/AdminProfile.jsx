import "./adminProfile.scss";
import org_axios from "axios";
import axios from "../../axios";
import { useContext, useEffect, useRef, useState } from "react";
import { userInputs } from "../../formSource";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { format } from "date-fns";
import { AuthContext } from "../../context/AuthContext";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";

const PHONE_REGEX =
  /^(?:\d{3}\s?\d{4}\s?\d{4}|\+\d{1,3}\s?\(\d{1,4}\)\s?\d{1,4}(?:[-\s]?\d{1,4})*|\d{10,})$/;

const CITY_REGEX = /^[A-Za-z\s\']*([A-Za-z][A-Za-z\s\']*){3,}$/;
const COUNTRY_REGEX = /^[A-Za-z\s\']*([A-Za-z][A-Za-z\s\']*){3,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const AdminProfile = () => {
  const { user, loading, error, dispatch, accessToken } =
    useContext(AuthContext);
  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [changePwdMode, setChangePwdMode] = useState(false);
  const [updateBtn, setUpdateBtn] = useState(false);
  const [editBtn, setEditBtn] = useState(true);

  const userRef = useRef();
  const errRef = useRef();

  const [phone, setPhone] = useState(user?.phone);
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [phoneTabbed, setPhoneTabbed] = useState(false);

  const [city, setCity] = useState(user?.city);
  const [validCity, setValidCity] = useState(false);
  const [cityFocus, setCityFocus] = useState(false);
  const [cityTabbed, setCityTabbed] = useState(false);

  const [country, setCountry] = useState(user?.country);
  const [validCountry, setValidCountry] = useState(false);
  const [countryFocus, setCountryFocus] = useState(false);
  const [countryTabbed, setCountryTabbed] = useState(false);

  const [age, setAge] = useState("");

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

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [phoneExists, setPhoneExists] = useState(false);

  const [birthDate, setBirthDate] = useState(
    user?.birthDate ? new Date(user.birthDate) : null
  );
  const [birthDateFocus, setBirthDateFocus] = useState(false);
  const [birthDateTabbed, setBirthDateTabbed] = useState(false);
  const [validBirthDate, setValidBirthDate] = useState(true);

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 16);

  const [sidebar, setSidebar] = useState(false);

  const [currImg, setCurrImg] = useState(user?.img);
  const [uploading, setUploading] = useState(false);
  const [excceded, setExceeded] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user, country, city, birthDate, phone]);

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
    !birthDate ? setValidBirthDate(false) : setValidBirthDate(true);
    console.log(birthDate, user);
  }, [birthDate]);

  useEffect(() => {
    setValidOldPwd(PWD_REGEX.test(oldPwd));
    setWrongPwd(false);
    console.log(validOldPwd);
  }, [oldPwd]);
  useEffect(() => {
    console.log(validNewPwd, validMatch);
    setValidNewPwd(PWD_REGEX.test(newPwd));
    setValidMatch(newPwd === matchPwd);
  }, [newPwd, matchPwd]);

  useEffect(() => {
    console.log(info);
  }, [info]);

  useEffect(() => {
    console.log(user.birthDate);
    if (user.birthDate) {
      const currentYear = new Date().getFullYear();
      const birthYear = new Date(user.birthDate).getFullYear();
      const calculatedAge = currentYear - birthYear;
      setAge(calculatedAge);
    }
  }, [user]);

  useEffect(() => {
    setErrMsg("");
  }, [phone, city, country, age]);

  useEffect(() => {
    if (errMsg === "Phone Already exists") {
      setPhoneExists(true);
      setValidPhone(false);
    } else if (errMsg === "Wrong Password !") setWrongPwd(true);
    else {
      setPhoneExists(false);
      setWrongPwd(false);
    }
  }, [errMsg]);

  useEffect(() => {
    if (phoneFocus) setPhoneTabbed(true);
    if (cityFocus) setCityTabbed(true);
    if (countryFocus) setCountryTabbed(true);
    if (birthDateFocus) setBirthDateTabbed(true);
  }, [phoneFocus, countryFocus, cityFocus, birthDateFocus]);

  useEffect(() => {
    setCurrImg(user?.img);
  }, [user?.img]);

  useEffect(() => {
    console.log(file);
    file.size > 1024 * 1024 ? setExceeded(true) : setExceeded(false);
  }, [file]);

  const filteredInputs = userInputs.filter(
    (input) =>
      input.id !== "username" && input.id !== "email" && input.id !== "password"
  );

  const handleChange = (e) => {
    if (e.target.id === "phone") setPhone(e.target.value);
    else if (e.target.id === "city") setCity(e.target.value);
    else if (e.target.id === "country") setCountry(e.target.value);
    else if (e.target.id === "birthDate") setBirthDate(e.target.value);
    else if (e.target.id === "oldPwd") setOldPwd(e.target.value);
    else if (e.target.id === "newPwd") setNewPwd(e.target.value);
    else if (e.target.id === "matchPwd") setMatchPwd(e.target.value);
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleBirthDateChange = (date) => {
    setBirthDate(date);
    setInfo((prev) => ({ ...prev, birthDate: date }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setUpdateMode(true);
    setUpdateBtn(true);
    setEditBtn(false);
  };
  const handleChangePwdMode = async (e) => {
    setChangePwdMode(true);
  };
  const handleRemoveImg = () => {
    setCurrImg("");
    setFile(false);
    user.img = "";
  };

  let uploadedImgUrl = "";
  const handleUpload = async () => {
    if (!excceded) {
      setUploading(true);
      console.log("uploading....");
      try {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        const uploadRes = await org_axios.post(
          "https://api.cloudinary.com/v1_1/omarnasser/upload",
          data
        );
        uploadedImgUrl = uploadRes?.data?.url;
        setCurrImg(uploadRes?.data?.url);

        console.log(currImg, " uploaded");
        console.log(uploadRes?.data?.url);
        console.log("uploaded successfully");
      } catch (error) {
        console.log(error);
      }
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    setSubmitting(true);
    if (e) {
      e.preventDefault();
    }
    if (!(validCity && validCountry && validPhone)) {
      if (!validCity) setCityFocus(true);
      if (!validCountry) setCountryFocus(true);
      if (!validPhone) setPhoneFocus(true);
    } else {
      setUpdateBtn(false);
      try {
        if (file) await handleUpload();
        const newUser = {
          ...user,
          ...info,
          img: uploadedImgUrl || currImg,
        };
        console.log(newUser);
        setEditBtn(true);
        const res = await axios.put(`/users/${user._id}`, newUser, {
          headers: { accessToken: accessToken },
        });
        if (res.data) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: res.data.details,
            accessToken: res.data.accessToken,
          });
        }
        setUpdateMode(false);
      } catch (error) {
        setErrMsg(error.response.data.message);
        console.log(error);
      }
    }
  };

  const handleChangePwd = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    if (!validNewPwd && !validMatch && !validOldPwd) {
      if (!validNewPwd) setOldPwdFocus(true);
      if (!validMatch) setMatchFocus(true);
      if (!validOldPwd) setValidOldPwd(true);
      if (!birthDate) setBirthDateFocus(true);
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
          updatedUser,
          {
            headers: { accessToken: accessToken },
          }
        );
        setChangePwdMode(false);
      } catch (error) {
        setErrMsg(error.response.data.message);
        console.log(error);
      }
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${user._id}`, {
          headers: { accessToken: accessToken },
        });
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <div className="adminProfile">
      {sidebar && <Sidebar />}
      <div className="adminProfileContainer">
        <div className="sidebarWrapper">
          <div className="sidebarBtn">
            <button onClick={() => setSidebar(!sidebar)}>
              <ListOutlinedIcon className="icon" />
            </button>
          </div>
          <NavbarAdmin className="adminNavbar" />
        </div>
        {loading ? (
          <div className="loading">
            <img
              className="uploadHotelIcon"
              src="https://media.tenor.com/hlKEXPvlX48AAAAj/loading-loader.gif"
            />
            <span>loading...</span>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : uploading ? (
          <div className="uploading">
            <img
              className="uploadingUser"
              src="https://media.tenor.com/hQz0Kl373E8AAAAj/loading-waiting.gif"
            />
            <div>Updating Profile</div>
          </div>
        ) : (
          <div className="adminInfoWrapper">
            {!changePwdMode && (
              <>
                <h3>Admin Info : </h3>
                <div className="AdminInfo">
                  <div className="adminProfileImg">
                    <img
                      src={
                        file && !excceded
                          ? URL.createObjectURL(file)
                          : currImg ||
                            "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-18.jpg"
                      }
                      alt="Profile"
                    />
                    {updateMode && (
                      <div className="upload">
                        <label htmlFor="file" className="uploadIcon">
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
                    )}
                    {updateMode && excceded && (
                      <p className="exceededMsg">
                        Please, select Img size less than 1 MB to be uploaded
                      </p>
                    )}
                  </div>
                  <form className="adminForm">
                    <div className="infoLabels">
                      <label className="adminFormLabel">Username : </label>
                      <p> {user.username}</p>
                    </div>
                    <div className="infoLabels">
                      <label className="adminFormLabel">Email : </label>
                      <p> {user.email}</p>
                    </div>
                    {!updateMode &&
                      filteredInputs?.map((input) => (
                        <div className="infoLabels" key={input.id}>
                          <label className="adminFormLabel">
                            {input.label}:{" "}
                          </label>
                          <p>{user[input.id] ? user[input.id] : age}</p>
                        </div>
                      ))}

                    {updateMode && (
                      <>
                        <div className="formInput">
                          <label htmlFor="phone">
                            Phone :{" "}
                            <FontAwesomeIcon
                              icon={faCheck}
                              className={validPhone && phone ? "valid" : "hide"}
                            />
                            <FontAwesomeIcon
                              icon={faTimes}
                              className={
                                !validPhone && phone ? "invalid" : "hide"
                              }
                            />
                          </label>
                          <input
                            type="text"
                            id="phone"
                            onChange={handleChange}
                            value={!phoneTabbed ? user.phone : phone}
                            required
                            placeholder="012 5665 5648"
                            aria-invalid={validPhone ? "false" : "true"}
                            aria-describedby="phonenote"
                            onFocus={() => setPhoneFocus(true)}
                            onBlur={() => setPhoneFocus(false)}
                          />
                          <div className="infoMsg">
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
                        </div>
                        <div className="formInput">
                          <label htmlFor="country">
                            Country :{" "}
                            <FontAwesomeIcon
                              icon={faCheck}
                              className={
                                validCountry && country ? "valid" : "hide"
                              }
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
                            value={!countryTabbed ? user.country : country}
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
                              className={
                                !validCity && city ? "invalid" : "hide"
                              }
                            />
                          </label>
                          <input
                            type="text"
                            id="city"
                            onChange={handleChange}
                            value={!cityTabbed ? user.city : city}
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
                        <div className="formInput">
                          <label htmlFor="birthdate">Birthdate : </label>
                          <br />
                          <div
                            className="birthDate"
                            style={{ cursor: "pointer" }}
                          >
                            <div style={{ cursor: "pointer" }}>
                              <DatePicker
                                id="birthDate"
                                selected={birthDate}
                                onChange={handleBirthDateChange}
                                value={!birthDateTabbed ? birthDate : ""}
                                onFocus={() => setBirthDateFocus(true)}
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
                      </>
                    )}
                  </form>
                </div>
              </>
            )}
            {changePwdMode && (
              <>
                <h3>Change Password :</h3>
                <div className="adminChangePwdContainer">
                  <div className="adminChangePwdItem">
                    <label>
                      Old Password:
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={
                          validOldPwd && oldPwd && !wrongPwd ? "valid" : "hide"
                        }
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          (!validOldPwd && oldPwd) || wrongPwd
                            ? "invalid"
                            : "hide"
                        }
                      />
                    </label>
                    <input
                      className="changePwdInput"
                      type="password"
                      placeholder="********"
                      id="oldPwd"
                      onChange={handleChange}
                      autoComplete="off"
                      required
                      onFocus={() => setOldPwdFocus(true)}
                      onBlur={() => setOldPwdFocus(false)}
                      aria-invalid={validOldPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                    />

                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {submitting && oldPwd === ""
                        ? "This field is required"
                        : ""}
                      {submitting && wrongPwd ? "Wrong Password" : ""}
                    </p>
                  </div>
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
                  <div className="adminChangePwdItem">
                    <label>
                      New Password:
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
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {submitting && newPwd === ""
                        ? "This field is required"
                        : ""}
                    </p>
                  </div>
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
                  <div className="adminChangePwdItem">
                    <label>
                      Confirm Password:
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
                      id="matchPwd"
                      onChange={handleChange}
                      autoComplete="off"
                      required
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="pwdnote"
                    />
                    <p
                      ref={errRef}
                      className="inputErrMsg"
                      aria-live="assertive"
                    >
                      {submitting && matchPwd === ""
                        ? "This field is required"
                        : ""}
                    </p>
                  </div>
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
                    Must match the new password field.
                  </p>

                  <button
                    className="changePwdBtn"
                    disabled={loading}
                    onClick={handleChangePwd}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {!updateMode && !changePwdMode && (
              <div className="btnWrapper">
                <button className="Btn" onClick={handleEdit}>
                  Edit Profile
                </button>
                <button className="Btn" onClick={handleChangePwdMode}>
                  Change Password
                </button>
              </div>
            )}
            {updateMode && !changePwdMode && (
              <div className="btnWrapper">
                {!excceded && (
                  <button
                    className={!excceded ? "Btn" : "notAllowed"}
                    onClick={() => handleUpdate()}
                  >
                    Update
                  </button>
                )}
                <button className="Btn" onClick={() => setUpdateMode(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
