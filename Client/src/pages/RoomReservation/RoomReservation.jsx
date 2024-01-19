import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import "./roomReservation.scss";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import axios from "../../axios";

const RoomReservation = () => {
  const { hotelId, roomTypeId } = useParams();
  const {
    data: roomType,
    loading,
    error,
    reFetch,
  } = useFetch(`/rooms/${roomTypeId}`);
  const { date: contextDate, options } = useContext(SearchContext);
  const [date, setDate] = useState(contextDate);
  const [dateFound, setDateFound] = useState(false);
  const [currSelectedDate, setCurrSelectedDate] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState();
  const [noOfPeople, setNoOfPeople] = useState(0);

  //maxPeople filter
  useEffect(() => {
    if (options.adult !== undefined && options.children !== undefined)
      setNoOfPeople(options.adult + options.children);
  }, [options]);

  //Check if date found or not
  useEffect(() => {
    console.log(
      (date[0].startDate === undefined ||
        date[0].endDate === undefined ||
        date[0].startDate === null ||
        date[0].endDate === null) &&
        contextDate[0].startDate === undefined,
      contextDate[0].endDate === undefined
    );
    if (
      (date[0].startDate === undefined ||
        date[0].endDate === undefined ||
        date[0].startDate === null ||
        date[0].endDate === null) &&
      contextDate[0].startDate === undefined
    ) {
      setDateFound(false);
      console.log("date found");
    } else {
      setDateFound(true);
      console.log("date not found !!");
    }
    if (!(contextDate[0].startDate || dateFound)) setOpenCalendar(true);

    console.log("date:", date[0]);
    console.log("contextDate: ", contextDate);
    const reservationDays =
      (date[0].endDate - date[0].startDate) / (24 * 60 * 60 * 1000);
    console.log("reservationDays: ", reservationDays);
  }, [date, contextDate]);

  //set date to the current selected one
  useEffect(() => {
    if (
      currSelectedDate[0].startDate !== undefined &&
      currSelectedDate[0].endDate !== undefined
    ) {
      setDate([
        {
          startDate: currSelectedDate[0].startDate,
          endDate: currSelectedDate[0].endDate,
          key: "selection",
        },
      ]);
    }
    console.log("");
    console.log("currSelectedDate : ", currSelectedDate[0]);
  }, [currSelectedDate]);

  useEffect(() => {
    console.log("selectedRoom: ", selectedRoom);
  }, [selectedRoom]);

  //return all dates between start and end dates
  const getDatesInRange = (startDate, endDate) => {
    if (startDate === undefined) {
      return []; // Return an empty array if startDate is undefined
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log(start, end);

    const initialDate =
      startDate !== undefined ? new Date(start.getTime()) : "";
    const dates = [];

    console.log(initialDate);
    while (initialDate <= end) {
      dates.push(new Date(initialDate).getTime());
      initialDate.setDate(new Date(initialDate.getDate() + 1));
    }
    return dates;
  };

  const allDates =
    date[0].startDate !== undefined && date[0].startDate !== undefined
      ? getDatesInRange(date[0].startDate, date[0].endDate)
      : null;

  const isAvailable = (roomNumber, maxPeople) => {
    console.log("roomNumber.unavailableDates: ", roomNumber.unavailableDates);
    console.log("allDates: ", allDates);
    const isFound = roomNumber?.unavailableDates?.some((date) =>
      allDates.includes(new Date(date).getTime())
    );
    console.log("noOfPeople: ", noOfPeople);

    const hasEnoughCapacity = maxPeople ? maxPeople >= noOfPeople : true;
    console.log("hasEnoughCapacity: ", hasEnoughCapacity);
    const available = !isFound && hasEnoughCapacity;
    console.log(
      `Room ${roomNumber.number} is ${
        available ? "available" : "unavailable"
      } for selected dates`
    );
    return available;
  };

  const handeleReserveClick = async () => {
    document.body.scrollIntoView({
      behavior: "smooth",
    });
    setReserving(true);
    try {
      if (!selectedRoom) return;
      const hotelRes = await axios.get(`/hotels/find/${hotelId}`, {
        headers: {
          "Content-Type": "application/json",
          accesToken: localStorage.getItem("accessToken"),
        },
      });

      const hotelName = hotelRes.data.name;
      const city = hotelRes.data.city;
      const country = hotelRes.data.country;
      const hotelImages = hotelRes.data.photos;

      const roomRes = await axios.get(`/rooms/${roomTypeId}`, {
        headers: {
          "Content-Type": "application/json",
          accesToken: localStorage.getItem("accessToken"),
        },
      });

      const roomPrice = roomRes.data.price;
      const roomImages = roomRes.data.images;
      const reservationDays =
        (date[0].endDate - date[0].startDate) / (24 * 60 * 60 * 1000) + 1;

      const reservationObj = {
        userId: JSON.parse(localStorage.getItem("user"))._id,
        hotelId,
        roomTypeId: roomType._id,
        roomNumberId: selectedRoom,
        reservationDuration: {
          startDate: date[0].startDate || contextDate[0].startDate,
          endDate: date[0].endDate || contextDate[0].endDate,
        },
        cost:
          reservationDays * roomPrice === 0
            ? roomPrice
            : reservationDays * roomPrice,
      };
      console.log(reservationObj);
      const reserveRes = await axios.post(`/reservations`, reservationObj);

      console.log(reserveRes);

      const reserveObj = {
        reservationId: reserveRes?.data?._id,
        userId: JSON.parse(localStorage.getItem("user"))._id,
        hotelId,
        hotelName,
        hotelImages,
        city,
        country,
        roomTypeId,
        roomNumberId: selectedRoom,
        roomImages,
        reservationDuration: {
          startDate: date[0].startDate,
          endDate: date[0].endDate,
        },
        cost:
          reservationDays * roomPrice === 0
            ? roomPrice
            : reservationDays * roomPrice,
      };
      await axios
        .post(`/reservations/create-checkout-session`, {
          reservation: reserveObj,
        })
        .then(async (res) => {
          if (res?.data?.url) {
            window.location.href = res.data.url;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      setReserving(false);
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data);
    }
  };

  return (
    <div className="reserveRoomContainer">
      <Navbar />
      <div className="changeReserveDate">
        <button
          onClick={() => setOpenCalendar(!openCalendar)}
          className={`changeDateBtn ${dateFound ? "" : "disabled"} `}
          disabled={!dateFound}
        >
          Change Date Duration
        </button>
      </div>
      <div className="reserveWrapper">
        {error ? (
          <div className="roomError">something went wrong {error}</div>
        ) : loading ? (
          <div className="roomLoading">
            <img src="https://media.tenor.com/hQz0Kl373E8AAAAj/loading-waiting.gif" />
            <p>Loading...</p>
          </div>
        ) : reserving ? (
          <div className="reservingRoom">
            <img src="https://media.tenor.com/hQz0Kl373E8AAAAj/loading-waiting.gif" />
            <p>Reserving ...</p>
          </div>
        ) : (
          <>
            {(contextDate[0].startDate || dateFound) && !openCalendar ? (
              <>
                <div className="roomInfoImagesWrapper">
                  <div className="roomReserveInfo">
                    <div className="reserveRoomTitle">
                      <h4>{roomType.title} Room</h4>
                    </div>
                    <div className="reserveRoomDesc">
                      <h6>Description: {roomType.desc}</h6>
                    </div>
                    <div className="reservePrice">
                      <h6>Price: {roomType.price}</h6>
                    </div>
                    <div className="maxPeople">
                      <h6>Max people Allowed: {roomType.maxPeople}</h6>
                    </div>
                  </div>
                  <div className="roomImages">
                    {roomType?.images?.map((image) => (
                      <div className="roomImage">
                        <img src={image} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="reserveRoomNumbers">
                  <label>Room Numbers:</label>
                  <div className="numbers">
                    {roomType?.roomNumbers?.map((roomNumber) => (
                      <div className="room" key={roomNumber._id}>
                        <label>{roomNumber.number}</label>
                        <input
                          type="radio"
                          name="roomSelection"
                          checked={selectedRoom === roomNumber._id}
                          value={roomNumber._id}
                          onChange={(e) => setSelectedRoom(e.target.value)}
                          disabled={
                            !isAvailable(roomNumber, roomType.maxPeople)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className={`reserveBtn ${selectedRoom ? "" : "disabled"}`}
                  onClick={handeleReserveClick}
                  disabled={!selectedRoom}
                >
                  Reserve
                </button>
              </>
            ) : (
              <>
                {openCalendar && (
                  <div className="newDateRoomReserve">
                    <h3 className="dateTitle">
                      Please, select duration to reserve
                    </h3>
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      onClick={() => setOpenCalendar(false)}
                      className={`closeIcon ${dateFound ? "" : "disabled"}`}
                      disabled={!dateFound}
                    />

                    <div className="dateRangeRoomReserve" on>
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) =>
                          setCurrSelectedDate([item.selection])
                        }
                        moveRangeOnFirstSelection={false}
                        ranges={currSelectedDate}
                        className="dateReserveRoom"
                        minDate={new Date()}
                      />
                    </div>
                    <button
                      className={`closeCalendarBtn ${
                        dateFound ? "" : "disabled"
                      }`}
                      onClick={() => setOpenCalendar(false)}
                      disabled={!dateFound}
                    >
                      OK
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoomReservation;
