import "./newReservation.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css"; // theme css file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { format, setDate } from "date-fns";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { parseISO } from "date-fns";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

const NewReservation = () => {
  const navigate = useNavigate();

  const [info, setInfo] = useState({});
  const [userId, setUserId] = useState();
  const [hotelId, setHotelId] = useState();
  const [rooms, setRooms] = useState();
  const [roomTypeId, setRoomTypeId] = useState();
  const [roomNumbers, setRoomNumbers] = useState();
  const [roomNumberId, setRoomNumberId] = useState();
  const [duration, setDuration] = useState();
  const [error, setError] = useState(false);
  const [openCalender, setOpenCalender] = useState(false);

  const reservationRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [hotel, setHotel] = useState("");
  const [validHotel, setValidHotel] = useState(false);
  const [hotelFocus, setHotelFocus] = useState(false);

  const [roomType, setRoomType] = useState("");
  const [validRoomType, setValidRoomType] = useState(false);
  const [roomTypeFocus, setRoomTypeFocus] = useState(false);

  const [roomNumber, setRoomNumber] = useState("");
  const [validRoomNumber, setValidRoomNumber] = useState(false);
  const [roomNumberFocus, setRoomNumberFocus] = useState(false);

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
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [disabledDates, setDisabledDates] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    console.log(selectedDates);
  }, [selectedDates]);

  useEffect(() => {
    setValidUser(user === "" ? false : true);
    console.log(user);
  }, [user]);

  useEffect(() => {
    setValidHotel(hotel === "" ? false : true);
    console.log(hotel);
  }, [hotel]);

  useEffect(() => {
    setValidRoomType(roomType === "" ? false : true);
    console.log(roomType);
  }, [roomType]);

  useEffect(() => {
    setValidRoomNumber(roomNumber === "" ? false : true);
    console.log(roomNumber);
  }, [roomNumber]);

  useEffect(() => {
    console.log(roomNumberId);
    if (!roomNumberId) setDisabledDates(true);
  }, [roomNumberId]);

  //set Disable dates
  useEffect(() => {
    if (roomTypeId && roomNumberId) {
      const fetchRoomNumber = async () => {
        console.log(roomTypeId, roomNumberId);
        const roomRes = await axios.get(
          `https://booking-fwaz.onrender.com/rooms/${roomTypeId}/${roomNumberId}`
        );
        return roomRes.data;
      };

      // Wait for the promise to resolve and then set the disabledDates
      fetchRoomNumber()
        .then((data) => {
          const unavailableDates = data.unavailableDates.map(
            (date) => new Date(date)
          );
          console.log(unavailableDates);
          setDisabledDates(unavailableDates);
        })
        .catch((error) => {
          console.error("Error fetching room number:", error);
        });
    }
  }, [roomNumber]);

  useEffect(() => {
    console.log(dates);
    if (dates === "") setValidDates(false);
  }, [dates]);

  const handleDateSelection = (ranges) => {
    console.log(ranges.selection);

    if (ranges.selection) setDateRange(ranges.selection);
    const selectedRange = ranges.selection;

    if (selectedRange.startDate && selectedRange.endDate) {
      // Update the selected dates
      setSelectedDates(selectedRange);
      console.log(selectedRange.startDate, selectedRange.endDate);
    } else {
      // If the same day is selected twice, clear the selection
      setSelectedDates([
        {
          startDate: null,
          endDate: null,
          key: "selection",
        },
      ]);
    }
  };

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  const {
    data: users,
    error: userError,
    loading: usersLoading,
  } = useFetch("https://booking-fwaz.onrender.com/users/getUsers/all");

  console.log(users);

  const {
    data: hotels,
    error: hotelsError,
    loading,
    hotelsLoading,
  } = useFetch("https://booking-fwaz.onrender.com/hotels");

  console.log(hotelId);
  console.log(hotels);
  console.log(rooms);
  console.log(duration);
  console.log(info);
  console.log(roomTypeId);
  console.log(user);
  console.log(validUser);

  //fetch hotel's rooms
  useEffect(() => {
    const fetch = async () => {
      if (hotelId) {
        try {
          const roomsRes = await axios.get(
            `https://booking-fwaz.onrender.com/hotels/room/${hotelId}`
          );
          setRooms(roomsRes.data);
          return roomsRes.data;
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetch();
    console.log(rooms);
  }, [hotelId]);

  //fetch room's numbers
  useEffect(() => {
    const fetch = async () => {
      if (roomTypeId) {
        const roomsRes = await axios.get(
          `https://booking-fwaz.onrender.com/rooms/${roomTypeId}`
        );
        console.log(roomsRes.data.roomNumbers);
        setRoomNumbers(roomsRes.data.roomNumbers);
        return roomsRes.data;
      }
    };
    fetch();
    console.log(roomNumbers);
  }, [roomTypeId]);

  const handleChange = (e) => {
    if (e.target.name === "userId") {
      setUserId(e.target.value);
      setUser(e.target.value);
    } else if (e.target.name === "hotelId") {
      setHotelId(e.target.value);
      setHotel(e.target.value);

      // Clear other related states when hotel changes
      setRoomTypeId("");
      setRoomNumberId("");

      setRooms(false);
      setRoomNumbers(false);

      setRoomTypeFocus(false);
      setRoomNumberFocus(false);
    } else if (e.target.name === "roomTypeId") {
      setRoomTypeId(e.target.value);
      setRoomType(e.target.value);
      // Clear room number when room type changes
      setRoomNumberId("");
      setRoomNumbers(false);
      setRoomNumberFocus(false);
      setDateFocus(false);
      setSelectedDates([
        {
          startDate: null,
          endDate: null,
          key: "selection",
        },
      ]);
    } else if (e.target.name === "roomNumberId") {
      setRoomNumberId(e.target.value);
      setRoomNumber(e.target.value);
      setSelectedDates([
        {
          startDate: null,
          endDate: null,
          key: "selection",
        },
      ]);
    }
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    console.log(dates.startDate, dates.endDate);
    console.log(!dateFocus);
    console.log(validDates);
  }, [validDates, dateFocus, dates]);

  useEffect(() => {
    if (openCalender) {
      setDateFocus(true);
    }
  }, [openCalender]);
  const handleCalendar = () => {
    if (roomNumberId) {
      setOpenCalender(!openCalender);
      setErrMsg("");
    } else {
      setErrMsg("You have to choose room number first");
    }
  };

  useEffect(() => {
    console.log(
      validUser,
      validHotel,
      validRoomType,
      validRoomNumber,
      validDates
    );
  }, [user, hotel, roomType, roomNumber, dates]);

  useEffect(() => {
    setOpenCalender(false);
    setValidDates(false);
    setDateFocus(false);
  }, [roomNumberId]);

  const handleSubmition = async (e) => {
    e.preventDefault();
    if (
      !(
        validUser &&
        validHotel &&
        validRoomType &&
        validRoomNumber &&
        validDates
      )
    ) {
      if (!validUser) setUserFocus(true);
      if (!validHotel) setHotelFocus(true);
      if (!validRoomType) setRoomTypeFocus(true);
      if (!validRoomNumber) setRoomNumberFocus(true);
      if (!validDates) setDateFocus(true);
    } else {
      const roomRes = await axios.get(
        `https://booking-fwaz.onrender.com/rooms/${roomTypeId}`
      );
      const room = roomRes.data;
      const price = room.price;
      try {
        // structure reservation object to be stored
        const newReservation = {
          ...info,
          reservationDuration: {
            startDate: selectedDates.startDate,
            endDate: selectedDates.endDate,
          },
          cost:
            dayDifference(
              new Date(selectedDates.startDate),
              new Date(selectedDates.endDate)
            ) === 0
              ? price
              : dayDifference(
                  new Date(selectedDates.startDate),
                  new Date(selectedDates.endDate)
                ) * price,
        };
        console.log(newReservation);
        const reservationRes = await axios.post(
          `https://booking-fwaz.onrender.com/hotels/reserve/${hotelId}`,
          newReservation
        );
        //assign reservation duration to room's unavailable dates
        try {
          const roomAvailabilityDates = getDatesInRange(
            new Date(selectedDates.startDate),
            new Date(selectedDates.endDate)
          );

          console.log(roomAvailabilityDates);

          const roomAvailabilityRes = await axios.put(
            `https://booking-fwaz.onrender.com/rooms/availability/${roomNumberId}`,
            {
              dates: roomAvailabilityDates,
            }
          );
        } catch (err) {
          console.log(err);
        }
        navigate("/reservations");
      } catch (error) {
        console.log(error);
      }
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
        <div className="top">
          <h3>Add New Reservation</h3>
        </div>
        <div className="bottom">
          <form action="">
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <div className="wrapper">
              <div className="formInput">
                <label>
                  User{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validUser && user !== "" ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validUser || (user === "" && !userFocus)
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <select
                  name="userId"
                  onChange={handleChange}
                  value={userId}
                  onFocus={() => setUserFocus(true)}
                >
                  {usersLoading ? (
                    <option>loading</option>
                  ) : (
                    <>
                      <option value="">Select user</option>
                      {users.map((user) => (
                        <option value={user._id}>{user.username}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div className="formInput">
                <label>
                  Hotel{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={
                      validHotel && hotel && hotelFocus !== ""
                        ? "valid"
                        : "hide"
                    }
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validHotel || (hotel === "" && !hotelFocus)
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <select
                  name="hotelId"
                  onChange={handleChange}
                  value={hotelId}
                  defaultValue={""}
                  onFocus={() => setHotelFocus(true)}
                >
                  {hotelsLoading ? (
                    <option>loading</option>
                  ) : (
                    <>
                      <option value="">Select a hotel</option>
                      {hotels.map((hotel) => (
                        <option value={hotel._id}>{hotel.name}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="wrapper">
              <div className="formInput">
                <label>
                  Room Type:{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={
                      validRoomType && roomType !== "" && roomTypeFocus
                        ? "valid"
                        : "hide"
                    }
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validRoomType || (roomType === "" && !roomTypeFocus)
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <select
                  name="roomTypeId"
                  onChange={handleChange}
                  value={roomTypeId}
                  onFocus={() => setRoomTypeFocus(true)}
                >
                  <option value="">Select a room</option>
                  {rooms &&
                    rooms.map((room) => (
                      <option value={room._id}>{room.title}</option>
                    ))}
                </select>
              </div>

              <div className="formInput">
                <label>
                  Room Number:{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={
                      validRoomNumber && roomNumber !== "" && roomNumberFocus
                        ? "valid"
                        : "hide"
                    }
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validRoomNumber || (roomNumber === "" && !roomNumberFocus)
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <select
                  name="roomNumberId"
                  onChange={handleChange}
                  onFocus={() => setRoomNumberFocus(true)}
                >
                  <option value="">Select a room number</option>
                  {roomNumbers &&
                    roomNumbers.map((roomNumber) => (
                      <option value={roomNumber._id}>
                        {roomNumber.number}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="dateRange">
              <div className="headerDate" onClick={handleCalendar}>
                <label>
                  Duration of Reservation:{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={
                      validDates && dates !== "" && dateFocus ? "valid" : "hide"
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
                  {`${format(dateRange.startDate, "dd/MM/yyyy ")}`} to
                  {`${format(dateRange.endDate, " dd/MM/yyyy")}`}
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
                  disabledDates={roomNumberId ? disabledDates : currentDay}
                />
              )}
            </div>

            <div className="wrapper">
              <button className="submitBtn" onClick={handleSubmition}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="errMsg">{error}</div>
    </div>
  );
};

export default NewReservation;
