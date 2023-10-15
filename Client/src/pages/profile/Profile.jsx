import "./profile.scss";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const PHONE_REGEX =
  /^(?:\d{3}\s?\d{4}\s?\d{4}|\+\d{1,3}\s?\(\d{1,4}\)\s?\d{1,4}(?:[-\s]?\d{1,4})*|\d{10,})$/;
const CITY_REGEX = /^[A-Za-z\s\']*([A-Za-z][A-Za-z\s\']*){3,}$/;
const COUNTRY_REGEX = /^[A-Za-z\s\']*([A-Za-z][A-Za-z\s\']*){3,}$/;

const Profile = () => {
  const {
    user: fetchedUser,
    loading,
    error,
    reFetch,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(fetchedUser);
  const [userInfo, setUserInfo] = useState(null);
  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [updateBtn, setUpdateBtn] = useState(false);
  const [editBtn, setEditBtn] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [reservationData, setReservationData] = useState([]);

  const userRef = useRef();
  const errRef = useRef();

  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [city, setCity] = useState("");
  const [validCity, setValidCity] = useState(false);
  const [cityFocus, setCityFocus] = useState(false);

  const [country, setCountry] = useState("");
  const [validCountry, setValidCountry] = useState(false);
  const [countryFocus, setCountryFocus] = useState(false);

  const [age, setAge] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);

  const [BirthDate, setBirthDate] = useState(null);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 16);

  console.log(reservations);
  console.log(reservationData);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user, country, city, BirthDate, phone]);

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
    } else setPhoneExists(false);
  }, [errMsg]);

  const [submitting, setSubmitting] = useState(false);

  const [height, setHeight] = useState((reservationData.length / 5) * 200);

  //update Height
  useEffect(() => {
    setHeight(
      (reservationData.length / 5) * 200 < 80
        ? 80
        : (reservationData.length / 5) * 200
    );
  }, [reservationData]);

  const filteredInputs = userInputs.filter(
    (input) =>
      input.id !== "username" && input.id !== "email" && input.id !== "password"
  );

  const handleChange = (e) => {
    if (e.target.id === "phone") setPhone(e.target.value);
    else if (e.target.id === "city") setCity(e.target.value);
    else if (e.target.id === "country") setCountry(e.target.value);
    else if (e.target.id === "birthDate") setBirthDate(e.target.value);
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
  const handleChangePwd = async (e) => {
    navigate(`/profile/changePwd`);
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
      setUpdateMode(false);
      try {
        const newUser = {
          ...user,
          ...info,
          img: file ? file.name : user.img,
        };
        try {
          console.log(newUser);
          setEditBtn(true);
          const res = await axios.put(
            `https://booking-fwaz.onrender.com/users/${user._id}`,
            newUser
          );
          setUser(newUser);
        } catch (err) {
          console.log(err);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getReservations = async () => {
    try {
      const reservationsRes = await axios.get(
        `https://booking-fwaz.onrender.com/users/reservations/${user._id}`
      );
      const lastUpdatedReservations = reservationsRes.data;
      console.log(lastUpdatedReservations);
      setReservations(lastUpdatedReservations);
    } catch (error) {
      console.log(error);
    }
  };

  const getReservationsData = async () => {
    const uniqueReservationData = [];

    for (const reservation of reservations) {
      try {
        const [hotel, roomType, roomNumber] = await Promise.all([
          axios.get(
            `https://booking-fwaz.onrender.com/hotels/find/${reservation.hotelId}`
          ),
          axios.get(
            `https://booking-fwaz.onrender.com/rooms/${reservation.roomTypeId}`
          ),
          axios.get(
            `https://booking-fwaz.onrender.com/rooms/${reservation.roomTypeId}/${reservation.roomNumberId}`
          ),
        ]);

        const resvData = {
          id: reservation._id,
          hotel: hotel.data,
          roomType: roomType.data,
          roomNumber: roomNumber.data,
          startDate: reservation.reservationDuration.startDate,
          endDate: reservation.reservationDuration.endDate,
          cost: reservation.cost,
        };

        const existingIndex = uniqueReservationData.findIndex(
          (resv) => resv.id === resvData.id
        );

        if (existingIndex === -1) {
          uniqueReservationData.push(resvData);
        }
      } catch (error) {
        console.log(error);
      }
    }

    setReservationData(uniqueReservationData); // Moved outside the loop
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://booking-fwaz.onrender.com/users/${user._id}`
        );
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    getReservations();
  }, []);

  const [reservationsLoading, setReservationsLoading] = useState(true);
  useEffect(() => {
    if (reservations.length > 0) {
      getReservationsData()
        .then(() => setReservationsLoading(false)) // Step 2
        .catch((error) => {
          console.log(error);
          setReservationsLoading(false); // Handle any errors and still set loading to false
        });
    }
  }, [reservations]);

  const handleDelete = async (e) => {
    try {
      const resvDivId = e.target.dataset.reservationId;

      const resvationResponse = await axios.delete(
        `https://booking-fwaz.onrender.com/users/reservations/${resvDivId}`
      );

      const resvDivToDelete = reservationData.find(
        (resvDiv) => resvDiv.id === resvDivId
      );

      const updatedReservationData = reservationData.filter(
        (reservation) => reservation.id !== resvDivId
      );

      try {
        const reservationDateResponse = await axios.delete(
          `https://booking-fwaz.onrender.com/rooms/${resvDivToDelete.hotel._id}/${resvDivToDelete.roomType._id}/${resvDivToDelete.roomNumber._id}/${resvDivToDelete.startDate}/${resvDivToDelete.endDate}`
        );
      } catch (err) {
        console.log(err);
      }
      setReservationData(updatedReservationData); // Update reservationData directly

      getReservations(); // Fetch the updated list of reservations
      console.log(
        `Reservation with _id = ${resvDivId} has been successfully deleted`
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Profile">
      <div className="profileContainer">
        {loading ? (
          "Loading User Data...."
        ) : (
          <div className="info">
            <div className="profileImg">
              <img
                src={
                  file.name !== undefined
                    ? `/upload/profileImages/${file.name}`
                    : user?.img
                    ? `${process.env.PUBLIC_URL}/upload/profileImages/${user.img}`
                    : "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-18.jpg"
                }
                alt="Profile"
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
            </div>
            <form>
              <div className="infoLabels">
                <label>Username:</label>
                <p>{user.username}</p>
              </div>
              <div className="infoLabels">
                <label>Email:</label>
                <p>{user.email}</p>
              </div>
              {!updateMode &&
                filteredInputs?.map((input) => (
                  <div className="infoLabels" key={input.id}>
                    <label>{input.label}</label>
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
                  <div className="formInput">
                    <label htmlFor="birthdate">Birthdate : </label>
                    <br />
                    <div className="birthDate" style={{ cursor: "pointer" }}>
                      <div style={{ cursor: "pointer" }}>
                        <DatePicker
                          id="birthDate"
                          selected={BirthDate}
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
                          {submitting && BirthDate === null
                            ? "This field is required"
                            : ""}
                        </p>
                      </div>
                      <br />
                    </div>
                  </div>
                </>
              )}
              {editBtn && (
                <>
                  <button className="Btn" onClick={handleEdit}>
                    Edit Profile
                  </button>
                  <button className="Btn" onClick={handleChangePwd}>
                    ChangePassword
                  </button>
                </>
              )}
              {updateBtn && (
                <button className="Btn" onClick={() => handleUpdate()}>
                  Update
                </button>
              )}
            </form>
          </div>
        )}
        {
          <div className="reservations" style={{ height: `${height}vh` }}>
            <h2 className="title" onClick={() => navigate(`/`)}>
              My Nights
            </h2>
            {reservationsLoading ? (
              <>
                <div className="loading">loading reservations...</div>
              </>
            ) : (
              <>
                <h4
                  className="resSubTitle"
                  style={{ color: "rgb(66, 66, 66)" }}
                >
                  Reservations:
                </h4>
                {reservationData?.map((reservation, index) => {
                  if (Object.keys(reservation).length === 0) return null;
                  return (
                    <div
                      className="eachReservation"
                      key={index}
                      id={reservation.id}
                    >
                      <div className="property">
                        <label>Hotel:</label> <p>{reservation.hotel.name}</p>
                      </div>
                      <div className="property">
                        <label>Room Type:</label>{" "}
                        <span>{reservation.roomType.title}</span>
                      </div>
                      <div className="property">
                        <label>Room Number:</label>{" "}
                        <span>{reservation.roomNumber.number}</span>
                      </div>
                      <div className="property">
                        <label>Duration:</label>{" "}
                        <span>
                          {`${format(
                            new Date(reservation.startDate),
                            "dd/MM/yyyy"
                          )} to ${format(
                            new Date(reservation.endDate),
                            "dd/MM/yyyy"
                          )}`}
                        </span>
                      </div>
                      <div className="property">
                        <label>Cost:</label> <span>{reservation.cost}</span>
                      </div>
                      <button
                        className="Btn"
                        data-reservation-id={reservation.id}
                        onClick={handleDelete}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default Profile;
