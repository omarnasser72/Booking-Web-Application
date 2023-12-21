import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./reserve.css";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { DateRange } from "react-date-range";
import { id } from "date-fns/locale";

const Reserve = ({ hotelId }) => {
  const navigate = useNavigate();
  const { date: contextDate, options } = useContext(SearchContext);
  const [date, setDate] = useState(contextDate);
  console.log(contextDate[0]);
  const [noOfPeople, setNoOfPeople] = useState(0);
  const { data: rooms, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [dateFound, setDateFound] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [reserving, setReserving] = useState(false);

  const [height, setHeight] = useState(150);

  //selected date in DateRange Component
  const [currSelectedDate, setCurrSelectedDate] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  useEffect(() => {
    console.log("rooms: ", rooms);
  }, [rooms]);

  //maxPeople filter
  useEffect(() => {
    if (options.adult !== undefined && options.children !== undefined)
      setNoOfPeople(options.adult + options.children);
  }, [options]);

  useEffect(() => {
    console.log(openCalendar);
  }, [openCalendar]);

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
    console.log(date[0]);

    console.log("contextDate: ", contextDate);
  }, [date, contextDate]);

  useEffect(() => {
    if (dateFound) console.log("dataFound: true");
    console.log("dateFound: ", dateFound);
    console.log(
      "contextDate[0].startDate || dateFound: ",
      contextDate[0].startDate || dateFound
    );
    if (!(contextDate[0].startDate || dateFound)) setOpenCalendar(true);
  }, [dateFound, contextDate]);

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
    console.log(currSelectedDate[0]);
  }, [currSelectedDate]);

  const handleSelect = (e, roomId) => {
    const checkedRooms = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checkedRooms
        ? [...selectedRooms, { value, roomId }]
        : selectedRooms.filter((item) => item.value !== value)
    );
  };

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

  useEffect(() => {
    console.log(allDates);
  }, [allDates]);

  const isAvailable = (roomNumber, maxPeople) => {
    console.log(roomNumber.unavailableDates);
    console.log(allDates);
    const isFound = roomNumber?.unavailableDates?.some((date) =>
      allDates.includes(new Date(date).getTime())
    );
    console.log(noOfPeople);

    const hasEnoughCapacity = maxPeople ? maxPeople >= noOfPeople : true;
    console.log(hasEnoughCapacity);
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
      behavior: "smooth", // Optional: Use smooth scrolling
    });
    setReserving(true);
    try {
      let reservationObjects = [];
      await Promise.all(
        selectedRooms.map(async (selectedRoom) => {
          if (!selectedRoom.value) return;
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

          const roomRes = await axios.get(`/rooms/${selectedRoom.roomId}`, {
            headers: {
              "Content-Type": "application/json",
              accesToken: localStorage.getItem("accessToken"),
            },
          });

          const roomPrice = roomRes.data.price;
          const roomImages = roomRes.data.images;
          const reservationDays =
            (date[0].endDate - date[0].startDate) / (24 * 60 * 60 * 1000);

          const reserveObj = {
            userId: JSON.parse(localStorage.getItem("user"))._id,
            hotelId,
            hotelName,
            hotelImages,
            city,
            country,
            roomTypeId: selectedRoom.roomId,
            roomNumberId: selectedRoom.value,
            roomImages,
            reservationDuration: {
              startDate: date[0].startDate || contextDate[0].startDate,
              endDate: date[0].endDate || contextDate[0].endDate,
            },
            cost:
              reservationDays * roomPrice === 0
                ? roomPrice
                : reservationDays * roomPrice,
          };
          reservationObjects.push(reserveObj);
        })
      );
      console.log(reservationObjects);
      await axios
        .post(`/reservations/create-checkout-session`, {
          reservations: reservationObjects,
        })
        .then(async (res) => {
          selectedRooms.map(async (selectedRoom) => {
            if (!selectedRoom.value) return;
            const res = await axios.put(
              `/rooms/availability/${selectedRoom.value}`,
              {
                dates: allDates,
              }
            );
            const room = await axios.get(`/rooms/${selectedRoom.roomId}`);
            const roomPrice = room.data.price;
            const reservationDays =
              (date[0].endDate - date[0].startDate) / (24 * 60 * 60 * 1000);
            const reserve = {
              userId: JSON.parse(localStorage.getItem("user"))._id,
              hotelId,
              roomTypeId: selectedRoom.roomId,
              roomNumberId: selectedRoom.value,
              reservationDuration: {
                startDate: date[0].startDate || contextDate[0].startDate,
                endDate: date[0].endDate || contextDate[0].endDate,
              },
              cost:
                reservationDays * roomPrice === 0
                  ? roomPrice
                  : reservationDays * roomPrice,
            };
            reservationObjects.push(reserve);
            const reserveRes = await axios.post(
              `/hotels/reserve/${hotelId}`,
              reserve
            );
            console.log(reserve);
            return res.data;
          });
          console.log(res);
          if (res?.data?.url) window.location.href = res.data.url;
        })
        .catch((error) => {
          console.log(error);
        });

      //navigate("/");
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    setHeight(rooms.length * 70 < 150 ? 150 : rooms.length * 70);
  }, [rooms]);

  useEffect(() => {
    console.log("Selected Rooms: ", selectedRooms);
  }, [selectedRooms]);

  useEffect(() => {
    console.log("openCalendar: ", openCalendar);
  }, [openCalendar]);

  return (
    <div className="reserve" style={{ height: `${height}vh` }}>
      <div className="reserveContainer">
        <>
          {error ? (
            <div className="errorRooms">{error}error occurss</div>
          ) : loading ? (
            <div className="loadingRooms">
              <img src="https://media.tenor.com/hQz0Kl373E8AAAAj/loading-waiting.gif" />
              <p>Loading Hotel's rooms</p>
            </div>
          ) : reserving ? (
            <div className="reservingRooms">
              <img src="https://media.tenor.com/hQz0Kl373E8AAAAj/loading-waiting.gif" />
              <p>Reserving ...</p>
            </div>
          ) : (
            <>
              <div className="changeDate">
                <button
                  onClick={() => setOpenCalendar(!openCalendar)}
                  className="changeDateBtn"
                >
                  Change Date Duration
                </button>
              </div>
              {(contextDate[0].startDate || dateFound) && !openCalendar ? (
                <>
                  <div>
                    <h1 className="selectRooms">Select rooms:</h1>
                  </div>
                  <div className="reservationRooms">
                    {rooms?.map((room) => (
                      <div
                        className="reserveRoom"
                        key={room._id}
                        // style={{ width: "100%" }}
                      >
                        <div className="roomInfo">
                          <div className="reserveRoomTitle">
                            <h4>Room Title: {room.title}</h4>
                          </div>
                          <div className="reserveRoomDesc">
                            Room Desc: {room.desc}
                          </div>
                          <div className="reservePrice">
                            Price: {room.price}
                          </div>
                          <div className="reserveMax">
                            Max people:<b> {room.maxPeople}</b>
                          </div>
                        </div>
                        <div className="roomImage">
                          <img src={room?.images[0]} />
                        </div>
                        <div className="reserveSelectedRooms">
                          <label>Room Numbers:</label>
                          <div className="roomNumbers">
                            {room.roomNumbers.map((roomNumber) => (
                              <div className="room">
                                <label>{roomNumber.number}</label>
                                <input
                                  type="checkbox"
                                  value={roomNumber._id}
                                  onChange={(e) => handleSelect(e, room._id)}
                                  disabled={
                                    !isAvailable(roomNumber, room.maxPeople)
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="reserveButton">
                    <button
                      onClick={handeleReserveClick}
                      className="reserveBtn"
                    >
                      Reserve
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {openCalendar && (
                    <div className="newDate">
                      <h3 className="dateTitle">
                        Please, select duration to reserve
                      </h3>
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        onClick={() => setOpenCalendar(false)}
                        className={`closeIcon ${dateFound ? "" : "disabled"}`}
                        disabled={!dateFound}
                      />

                      <div className="dateRange" on>
                        <DateRange
                          editableDateInputs={true}
                          onChange={(item) =>
                            setCurrSelectedDate([item.selection])
                          }
                          moveRangeOnFirstSelection={false}
                          ranges={currSelectedDate}
                          className="dateReserve"
                          minDate={new Date()}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default Reserve;
