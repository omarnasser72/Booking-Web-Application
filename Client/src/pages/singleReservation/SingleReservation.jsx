import "./singleReservation.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import moment from "moment";
import "moment-timezone";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";
import { AuthContext } from "../../context/AuthContext";

const SingleReservation = () => {
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const reservationId = location.pathname.split("/")[3];
  console.log(reservationId);
  const {
    data: reservation,
    loading,
    error,
    reFetch,
  } = useFetch(`/reservations/${reservationId}`);
  console.log(reservation);

  const {
    data: hotel,
    loading: loadingHotel,
    error: errhotel,
  } = useFetch(`/hotels/find/${reservation?.hotelId}`);

  const {
    data: room,
    loading: loadingRoom,
    error: errRoom,
  } = useFetch(`/rooms/${reservation?.roomTypeId}`);

  const [editMode, setEditMode] = useState(false);

  const [sidebar, setSidebar] = useState(false);
  const [roomNumber, setRoomNumber] = useState();
  const [slideNumber, setSlideNumber] = useState(0);
  const [isImgSliderOpen, setImgSlider] = useState(false);
  const [type, setType] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [openCalender, setOpenCalender] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [validDates, setValidDates] = useState(false);
  const [dateFocus, setDateFocus] = useState(false);
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const [dateRange, setDateRange] = useState({
    startDate: null, //new Date(),
    endDate: null, //new Date(),
    key: "selection",
  });

  const [disabledDates, setDisabledDates] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    if (reservation.hasOwnProperty("_id")) {
      const inputStartDate = moment(reservation.reservationDuration.startDate);
      const newStartDate = inputStartDate.add(1, "day");
      setStartDate(newStartDate.toISOString());

      const inputEndDate = moment(reservation.reservationDuration.endDate);
      const newEndDate = inputEndDate.add(1, "day");
      setEndDate(newEndDate.toISOString());
    }
  }, [reservation]);

  useEffect(() => {
    console.log("startDate:", startDate, "endDate:", endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    console.log(selectedDates);
  }, [selectedDates]);

  //set Disable dates
  useEffect(() => {
    if (reservation.hasOwnProperty("_id")) {
      if (reservation.roomTypeId && reservation.roomNumberId) {
        const fetchRoomNumber = async () => {
          console.log(reservation.roomTypeId, reservation.roomNumberId);
          const roomRes = await axios.get(
            `/rooms/${reservation.roomTypeId}/${reservation.roomNumberId}`,
            {
              headers: { accessToken: accessToken },
            }
          );
          return roomRes.data;
        };

        // Wait for the promise to resolve and then set the disabledDates
        fetchRoomNumber()
          .then((data) => {
            const unavailableDates = data.unavailableDates.map(
              (date) => new Date(date)
            );
            const startDateMs = startDate
              ? new Date(moment(startDate).subtract(1, "day").toISOString())
              : 0; //.getTime() : 0;
            const endDateMs = endDate ? new Date(endDate) : Infinity; //.getTime() : Infinity;

            // console.log("unavailableDates:", unavailableDates);
            // console.log("startDateMs:", startDateMs);
            // console.log("endDateMs:", endDateMs);

            const unavailableDatesWithLastResDates = unavailableDates.filter(
              (date) => {
                const dateMs = date; //.getTime();
                // console.log("dateMs:", dateMs);
                // console.log(
                //   "Filtering:",
                //   dateMs < startDateMs || dateMs > endDateMs
                // );
                return dateMs < startDateMs || dateMs > endDateMs;
              }
            );
            console.log(unavailableDates);
            console.log(unavailableDatesWithLastResDates);
            setDisabledDates(unavailableDatesWithLastResDates);
          })
          .catch((error) => {
            console.error("Error fetching room number:", error);
          });
      }
    }
  }, [roomNumber, startDate, endDate]);

  useEffect(() => {
    console.log(dates);
    if (dates === "") setValidDates(false);
  }, [dates]);

  useEffect(() => {
    if (selectedDates) {
      console.log(
        getDatesInRange(selectedDates.startDate, selectedDates.endDate)
      );
      setValidDates(true);
      setDates(selectedDates);
    }
  }, [selectedDates]);

  useEffect(() => {
    console.log(disabledDates);
  }, [disabledDates]);

  useEffect(() => {
    console.log(reservation);
  }, [reservation]);

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  useEffect(() => {
    console.log(dates.startDate, dates.endDate);
    console.log(selectedDates.startDate, selectedDates.endDate);
    console.log(!dateFocus);
    console.log(validDates);
  }, [validDates, dateFocus, dates]);

  useEffect(() => {
    if (openCalender) {
      setDateFocus(true);
    }
  }, [openCalender]);

  useEffect(() => {
    if (room && room.roomNumbers) {
      const roomN = room.roomNumbers.find(
        (roomNo) => roomNo._id === reservation.roomNumberId
      );
      if (roomN) {
        setRoomNumber(roomN);
      }
    }
    console.log(roomNumber);
  }, [room, reservation.roomNumberId]);

  useEffect(() => {
    console.log(slideNumber);
  }, [slideNumber]);

  useEffect(() => {
    console.log(isImgSliderOpen);
  }, [isImgSliderOpen]);

  const handleOpenImgSlider = (index, type) => {
    setSlideNumber(index);
    setType(type);
    setImgSlider(true);
    console.log(isImgSliderOpen);
  };

  const handleImgSliderMove = (direction) => {
    let newSlideNumber;
    if (type === "hotel" && hotel.photos && hotel.photos.length > 0) {
      if (direction === "l")
        newSlideNumber =
          slideNumber === 0 ? hotel.photos.length - 1 : slideNumber - 1;
      else
        newSlideNumber =
          slideNumber === hotel.photos.length - 1 ? 0 : slideNumber + 1;
      setSlideNumber(newSlideNumber);
    } else if (type === "room" && room.images && room.images.length > 0) {
      if (direction === "l")
        newSlideNumber =
          slideNumber === 0 ? room.images.length - 1 : slideNumber - 1;
      else
        newSlideNumber =
          slideNumber === room.images.length - 1 ? 0 : slideNumber + 1;
      setSlideNumber(newSlideNumber);
    }
  };

  const handleDateSelection = (ranges) => {
    if (ranges.selection) {
      const selectedRange = ranges.selection;
      console.log(selectedRange);
      if (
        selectedRange.startDate instanceof Date &&
        !isNaN(selectedRange.startDate) &&
        selectedRange.endDate instanceof Date &&
        !isNaN(selectedRange.endDate)
      ) {
        setDateRange(selectedRange);

        // Update the selected dates

        setSelectedDates(selectedRange);
      } else {
        console.log("Invalid date range");
      }
    }
  };

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  function dayDifference(startDate, endDate) {
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const getDatesInRange = (startDate, endDate) => {
    if (!startDate) {
      return []; // Return an empty array if startDate is undefined
    }

    const initialDate = new Date(startDate.getTime());
    const dates = [];

    console.log(initialDate);

    while (initialDate <= endDate) {
      console.log(initialDate);
      dates.push(new Date(initialDate).getTime());
      initialDate.setDate(new Date(initialDate).getDate() + 1);
    }

    return dates;
  };
  const currentDay = getDatesInRange(new Date(), new Date());

  const handleCalendar = () => {
    if (reservation.hasOwnProperty("_id")) {
      if (reservation.roomNumberId) {
        setOpenCalender(!openCalender);
        setErrMsg("");
      } else {
        setErrMsg("You have to choose room number first");
      }
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!validDates) {
      if (!validDates) setDateFocus(true);
    } else {
      const roomRes = await axios.get(`/rooms/${reservation.roomTypeId}`, {
        headers: { accessToken: accessToken },
      });
      const room = roomRes.data;
      const price = room.price;
      try {
        // structure reservation object to be stored
        const updatedReservation = {
          ...reservation,
          reservationDuration: {
            startDate: selectedDates.startDate,
            endDate: selectedDates.endDate,
          },
          cost:
            dayDifference(
              new Date(selectedDates.startDate),
              new Date(selectedDates.endDate)
            ) * price,
        };

        try {
          const deleteReservationUrl = `/rooms/${reservation.hotelId}/${reservation.roomTypeId}/${reservation.roomNumberId}/${reservation.reservationDuration.startDate}/${reservation.reservationDuration.endDate}`;
          console.log("DELETE URL:", deleteReservationUrl);

          const reservationDateResponse = await axios.delete(
            deleteReservationUrl,
            {
              headers: { accessToken: accessToken },
            }
          );
        } catch (error) {
          console.log(error);
        }
        console.log(updatedReservation);
        const reservationRes = await axios.put(
          `/reservations/${reservation._id}`,
          updatedReservation,
          {
            headers: { accessToken: accessToken },
          }
        );
        //assign reservation duration to room's unavailable dates
        try {
          const roomAvailabilityDates = getDatesInRange(
            new Date(selectedDates.startDate),
            new Date(selectedDates.endDate)
          );

          console.log(roomAvailabilityDates);

          const roomAvailabilityRes = await axios.put(
            `/rooms/availability/${reservation.roomNumberId}`,
            {
              dates: roomAvailabilityDates,
            },
            {
              headers: { accessToken: accessToken },
            }
          );
        } catch (err) {
          console.log(err);
        }
        navigate(`/adminDashboard/reservations`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="single">
      <div className="wrapper">
        {sidebar && <Sidebar />}
        <div className="singleContainer">
          <div className="sidebarBtn">
            <button onClick={() => setSidebar(!sidebar)}>
              <ListOutlinedIcon className="icon" />
            </button>
            <NavbarAdmin />
          </div>
          {isImgSliderOpen && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="closeImgSlider"
                onClick={() => setImgSlider(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="leftArrow"
                onClick={() => handleImgSliderMove("l")}
              />

              <div className="slideWrapper">
                <img
                  src={`${
                    type === "hotel"
                      ? hotel.photos[slideNumber]
                      : process.env.PUBLIC_URL
                  }/upload/rooms/${room.images[slideNumber]}`}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="rightArrow"
                onClick={() => handleImgSliderMove("r")}
              />
            </div>
          )}
          {loading ? (
            <div className="loading">Loading Reservation info... </div>
          ) : error ? (
            <div className="loading">{error}</div>
          ) : !editMode ? (
            reservation.hasOwnProperty("_id") && (
              <div className="infoWrapper">
                <button className="editBtn" onClick={() => setEditMode(true)}>
                  Edit
                </button>
                <h4 className="title">Information</h4>
                <div className="top">
                  <div className="left">
                    <div className="item">
                      <div className="topSection">
                        <div className="details">
                          <h4 className="itemTitle">
                            Reservation ID: {reservation._id}
                          </h4>
                          <div className="detailItem">
                            <span className="itemKey">
                              Reservation User ID:
                            </span>
                            <span className="itemValue">
                              {reservation.userId}
                            </span>
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">Hotel ID:</span>
                            <span className="itemValue">
                              {reservation.hotelId}
                            </span>
                            <span
                              className="itemKey"
                              style={{ marginLeft: "5%" }}
                            >
                              Hotel Name:
                            </span>
                            <span className="itemValue">
                              {loadingHotel ? "loading..." : hotel.name}
                            </span>
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">Room Type ID:</span>
                            <span className="itemValue">
                              {reservation.roomTypeId}
                            </span>
                            <span
                              className="itemKey"
                              style={{ marginLeft: "5%" }}
                            >
                              Room Name:
                            </span>
                            <span className="itemValue">
                              {loadingHotel ? "loading..." : room.title}
                            </span>
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">Room Number ID:</span>
                            <span className="itemValue">
                              {reservation.roomNumberId}
                            </span>
                            {roomNumber && (
                              <div style={{ marginTop: "2%" }}>
                                <span className="itemKey">Room Number:</span>
                                <span className="itemValue">
                                  {roomNumber.number}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">Start Date:</span>
                            <span className="itemValue">
                              {startDate.split("T")[0]}
                            </span>
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">End Date:</span>
                            <span className="itemValue">
                              {endDate.split("T")[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <h3>Hotel Images:</h3>
                    <div className="itemImg">
                      {hotel.photos?.map((photo, index) => {
                        return (
                          <img
                            src={
                              photo.includes("http")
                                ? photo
                                : `${process.env.PUBLIC_URL}/upload/hotels/${photo}`
                            }
                            alt=""
                            key={index}
                            onClick={() => handleOpenImgSlider(index, "hotel")}
                          />
                        );
                      })}
                    </div>
                    <h3>Room Images:</h3>
                    <div className="itemImg">
                      {room.images?.map((image, index) => {
                        return (
                          <img
                            src={`${process.env.PUBLIC_URL}/upload/rooms/${image}`}
                            alt=""
                            key={index}
                            onClick={() => handleOpenImgSlider(index, "room")}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            reservation.hasOwnProperty("_id") && (
              <div className="infoWrapper">
                <h4 className="title">Information</h4>
                <div className="top">
                  <div className="left">
                    <div className="item">
                      <div className="topSection">
                        <div className="details">
                          <h4 className="itemTitle">
                            Reservation ID: {reservation._id}
                          </h4>
                          <div className="detailItem">
                            <span className="itemKey">
                              Reservation User ID:
                            </span>
                            <span className="itemValue">
                              {reservation.userId}
                            </span>
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">Hotel ID:</span>
                            <span className="itemValue">
                              {reservation.hotelId}
                            </span>
                            <span
                              className="itemKey"
                              style={{ marginLeft: "5%" }}
                            >
                              Hotel Name:
                            </span>
                            <span className="itemValue">
                              {loadingHotel ? "loading..." : hotel.name}
                            </span>
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">Room Type ID:</span>
                            <span className="itemValue">
                              {reservation.roomTypeId}
                            </span>
                            <span
                              className="itemKey"
                              style={{ marginLeft: "5%" }}
                            >
                              Room Name:
                            </span>
                            <span className="itemValue">
                              {loadingHotel ? "loading..." : room.title}
                            </span>
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">Room Number ID:</span>
                            <span className="itemValue">
                              {reservation.roomNumberId}
                            </span>
                            {roomNumber && (
                              <div style={{ marginTop: "2%" }}>
                                <span className="itemKey">Room Number:</span>
                                <span className="itemValue">
                                  {roomNumber.number}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">Start Date:</span>
                            <span className="itemValue">
                              {startDate.split("T")[0]}
                            </span>
                          </div>
                          <div className="detailItem">
                            <span className="itemKey">End Date:</span>
                            <span className="itemValue">
                              {endDate.split("T")[0]}
                            </span>
                          </div>
                          <div className="dateRange">
                            <div
                              className="headerDate"
                              onClick={handleCalendar}
                            >
                              <label>
                                Duration of Reservation:{" "}
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className={
                                    validDates && dates !== "" && dateFocus
                                      ? "valid"
                                      : "hide"
                                  }
                                />
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className={
                                    validDates ||
                                    (((dates.startDate === undefined &&
                                      dates.endDate === undefined) ||
                                      dates === "") &&
                                      !dateFocus)
                                      ? "hide"
                                      : "invalid"
                                  }
                                />
                                <br />
                              </label>
                              <FontAwesomeIcon icon={faCalendarDays} />
                              <span
                                className="headerSearchText"
                                style={{ marginLeft: "5px" }}
                              >
                                {dateRange.startDate &&
                                dateRange.endDate &&
                                dateRange.startDate instanceof Date &&
                                dateRange.endDate instanceof Date
                                  ? `${format(
                                      dateRange.startDate,
                                      "dd/MM/yyyy "
                                    )} to ${format(
                                      dateRange.endDate,
                                      "dd/MM/yyyy"
                                    )}`
                                  : "Select a valid date range"}
                              </span>
                            </div>
                            {openCalender && (
                              <DateRange
                                editableDateInputs={true}
                                onChange={handleDateSelection}
                                moveRangeOnFirstSelection={false}
                                ranges={[dateRange]}
                                className="date"
                                minDate={new Date()}
                                disabledDates={disabledDates}
                              />
                            )}
                          </div>
                          <div className="btns">
                            <button
                              className="updateBtn"
                              onClick={handleSubmission}
                            >
                              Update
                            </button>
                            <button
                              className="cancelBtn"
                              onClick={() => setEditMode(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <h3>Hotel Images:</h3>
                    <div className="itemImg">
                      {hotel.photos?.map((photo, index) => {
                        return (
                          <img
                            src={photo}
                            alt=""
                            key={index}
                            onClick={() => handleOpenImgSlider(index, "hotel")}
                          />
                        );
                      })}
                    </div>
                    <h3>Room Images:</h3>
                    <div className="itemImg">
                      {room.images?.map((image, index) => {
                        return (
                          <img
                            src={`${process.env.PUBLIC_URL}/upload/rooms/${image}`}
                            alt=""
                            key={index}
                            onClick={() => handleOpenImgSlider(index, "room")}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleReservation;
