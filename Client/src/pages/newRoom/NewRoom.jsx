import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

const ROOM_TITLE_REGEX = /^[A-Za-z0-9\s.'-]{3,}$/;
const ROOM_DESCRIPTION_REGEX = /^.{10,500}$/;
const ROOM_PRICE_REGEX = /^\d+(\.\d{2})?$/;
const MAX_PEOPLE_REGEX = /^(?:[1-9]|10)$/;
const NUMBER_OF_ROOMS_REGEX = /^([1-9]|[1-9][0-9]|100)$/;

const NewHotel = () => {
  const [info, setInfo] = useState({});
  const [files, setFiles] = useState("");
  const [hotelId, setHotelId] = useState();
  const [rooms, setRooms] = useState();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch("/hotels");

  const roomRef = useRef();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const [roomTitle, setRoomTitle] = useState("");
  const [validRoomTitle, setValidRoomTitle] = useState(false);
  const [roomTitleFocus, setRoomTitleFocus] = useState(false);

  const [roomDesc, setRoomDesc] = useState("");
  const [validRoomDesc, setValidRoomDesc] = useState(false);
  const [roomDescFocus, setRoomDescFocus] = useState(false);

  const [roomPrice, setRoomPrice] = useState("");
  const [validRoomPrice, setValidRoomPrice] = useState(false);
  const [roomPriceFocus, setRoomPriceFocus] = useState(false);

  const [roomMaxPeople, setRoomMaxPeople] = useState("");
  const [validRoomMaxPeople, setValidRoomMaxPeople] = useState(false);
  const [roomMaxPeopleFocus, setRoomMaxPeopleFocus] = useState(false);

  const [noOfRooms, setNoOfRooms] = useState("");
  const [validNoOfRooms, setValidNoOfRooms] = useState(false);
  const [noOfRoomsFocus, setNoOfRoomsFocus] = useState(false);

  const [hotel, setHotel] = useState("");
  const [validHotel, setValidHotelName] = useState(false);
  const [hotelFocus, setHotelFocus] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    roomRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(roomTitle);
    setValidRoomTitle(ROOM_TITLE_REGEX.test(roomTitle));
  }, [roomTitle]);

  useEffect(() => {
    console.log(roomDesc);
    setValidRoomDesc(ROOM_DESCRIPTION_REGEX.test(roomDesc));
  }, [roomDesc]);

  useEffect(() => {
    console.log(roomPrice);
    setValidRoomPrice(ROOM_PRICE_REGEX.test(roomPrice));
  }, [roomPrice]);

  useEffect(() => {
    console.log(roomMaxPeople);
    setValidRoomMaxPeople(MAX_PEOPLE_REGEX.test(roomMaxPeople));
  }, [roomMaxPeople]);

  useEffect(() => {
    console.log(roomMaxPeople);
    setValidRoomMaxPeople(MAX_PEOPLE_REGEX.test(roomMaxPeople));
  }, [roomMaxPeople]);

  useEffect(() => {
    console.log(noOfRooms);
    setValidNoOfRooms(NUMBER_OF_ROOMS_REGEX.test(noOfRooms));
  }, [noOfRooms]);

  useEffect(() => {
    console.log(rooms);
  }, [rooms]);

  useEffect(() => {
    hotel !== "" ? setValidHotelName(true) : setValidHotelName(false);
  }, [hotel]);

  useEffect(() => {
    console.log(hotelId);
  }, [hotelId]);

  useEffect(() => {
    setHotelId(info.hotelId);
    console.log(info);
  }, [info]);

  useEffect(() => {
    setErrMsg("");
    console.log(info);
    console.log(
      validHotel,
      validNoOfRooms,
      validRoomDesc,
      validRoomMaxPeople,
      validRoomPrice,
      validRoomTitle
    );
  }, [hotel, noOfRooms, roomDesc, roomMaxPeople, roomPrice, roomTitle]);

  const handleChange = (e) => {
    if (e.target.id === "title") setRoomTitle(e.target.value);
    else if (e.target.id === "desc") setRoomDesc(e.target.value);
    else if (e.target.id === "price") setRoomPrice(e.target.value);
    else if (e.target.id === "maxPeople") setRoomMaxPeople(e.target.value);
    else if (e.target.id === "hotelId") setHotel(e.target.value);

    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    console.log(info);
  };

  const generateRoomNumbers = (e) => {
    const numbers = e.target.value;
    console.log(numbers);
    const roomNumbers = [];
    for (let i = 1; i <= numbers; i++) {
      roomNumbers.push(i);
    }
    setNoOfRooms(numbers);
    setRooms(roomNumbers);
  };

  const handleClick = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    if (
      !(
        validHotel &&
        validNoOfRooms &&
        validRoomDesc &&
        validRoomMaxPeople &&
        validRoomPrice &&
        validRoomTitle
      )
    ) {
      if (!validHotel) setHotelFocus(true);
      if (!validNoOfRooms) setNoOfRoomsFocus(true);
      if (!validRoomDesc) setRoomDescFocus(true);
      if (!validRoomMaxPeople) setRoomMaxPeopleFocus(true);
      if (!validRoomPrice) setRoomPriceFocus(true);
      if (!validRoomTitle) setRoomTitleFocus(true);
    } else {
      try {
        const roomNumbers = rooms?.map((roomNo) => ({
          number: roomNo,
          ununavailableDates: [],
        }));
        console.log(files);
        const newRoom = {
          ...info,
          images: Array.from(files).map((file) => file.name),
          roomNumbers,
        };
        const res = await axios.post(
          `https://booking-fwaz.onrender.com/rooms/${hotelId}`,
          newRoom
        );

        navigate("/rooms");
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
          <h3>Add New Room</h3>
        </div>
        <div className="bottom">
          {
            <div className="left">
              <img
                src={
                  files
                    ? URL.createObjectURL(files[0])
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
            </div>
          }
          <div className="right">
            <form action="">
              {
                <div className="formInput">
                  <label htmlFor="file">
                    <DriveFolderUploadOutlinedIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    style={{ display: "none" }}
                  />
                </div>
              }
              <div className="formInput">
                <label>
                  Room's Title{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validRoomTitle ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validRoomTitle || (roomTitle == "" && !roomTitleFocus)
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="2 bed room"
                  onChange={handleChange}
                  required
                  aria-invalid={validRoomTitle ? "false" : "true"}
                  aria-describedby="titlenote"
                  onFocus={() => setRoomTitleFocus(true)}
                  onBlur={() => setRoomTitleFocus(false)}
                />
                <p
                  id="titlenote"
                  className={
                    roomTitleFocus && roomTitle && !validRoomTitle
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <br />
                  Must begin with a letter. at least 3 letters
                  <br />
                  Allow letters (uppercase and lowercase), numbers, spaces,
                  dots, single quotes, and hyphens.
                </p>
                <p ref={errRef} className="inputErrMsg" aria-live="assertive">
                  {submitting && roomTitle === ""
                    ? "This field is required"
                    : ""}
                </p>
              </div>
              <div className="formInput">
                <label>
                  Room's Description:{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validRoomDesc ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validRoomDesc || (roomDesc == "" && !roomDescFocus)
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <input
                  type="text"
                  id="desc"
                  placeholder="King size bed, 1 bathroom"
                  onChange={handleChange}
                  required
                  aria-invalid={validRoomDesc ? "false" : "true"}
                  aria-describedby="descnote"
                  onFocus={() => setRoomDescFocus(true)}
                  onBlur={() => setRoomDescFocus(false)}
                />
                <p
                  id="descnote"
                  className={
                    roomDescFocus && roomDesc && !validRoomDesc
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <br />
                  Must be between 10 and 500 characters
                  <br />
                  Allow any character, including spaces and special characters.
                </p>
                <p ref={errRef} className="inputErrMsg" aria-live="assertive">
                  {submitting && roomDesc === ""
                    ? "This field is required"
                    : ""}
                </p>
              </div>
              <div className="formInput">
                <label>
                  Room's Price:{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validRoomPrice ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validRoomPrice || (roomPrice == "" && !roomPriceFocus)
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <input
                  type="text"
                  id="price"
                  placeholder="100"
                  onChange={handleChange}
                  required
                  aria-invalid={validRoomPrice ? "false" : "true"}
                  aria-describedby="priceenote"
                  onFocus={() => setRoomPriceFocus(true)}
                  onBlur={() => setRoomPriceFocus(false)}
                />
                <p
                  id="priceenote"
                  className={
                    roomPriceFocus && roomPrice && !validRoomPrice
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <br />
                  Must be number with optional decimal part
                </p>
                <p ref={errRef} className="inputErrMsg" aria-live="assertive">
                  {submitting && roomPrice === ""
                    ? "This field is required"
                    : ""}
                </p>
              </div>
              <div className="formInput">
                <label>
                  Room's Max People:{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validRoomMaxPeople ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validRoomMaxPeople ||
                      (roomMaxPeople == "" && !roomMaxPeopleFocus)
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <input
                  type="text"
                  id="maxPeople"
                  placeholder="2"
                  onChange={handleChange}
                  required
                  aria-invalid={validRoomMaxPeople ? "false" : "true"}
                  aria-describedby="maxpeoplenote"
                  onFocus={() => setRoomMaxPeopleFocus(true)}
                  onBlur={() => setRoomMaxPeopleFocus(false)}
                />
                <p
                  id="maxpeoplenote"
                  className={
                    roomMaxPeopleFocus && roomMaxPeople && !validRoomMaxPeople
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <br />
                  Must be a number between 1 and 10
                </p>
                <p ref={errRef} className="inputErrMsg" aria-live="assertive">
                  {submitting && roomMaxPeople === ""
                    ? "This field is required"
                    : ""}
                </p>
              </div>

              <div className="formInput">
                <label>
                  Number of Rooms{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={
                      validNoOfRooms && noOfRooms !== "" ? "valid" : "hide"
                    }
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validNoOfRooms || (noOfRooms === "" && !noOfRoomsFocus)
                        ? "hide"
                        : "invalid"
                    }
                  />
                </label>
                <input
                  type="text"
                  id="roomNumber"
                  onChange={generateRoomNumbers}
                  placeholder="50"
                  required
                  aria-invalid={validNoOfRooms ? "false" : "true"}
                  aria-describedby="noOfRoomsnote"
                  onFocus={() => setNoOfRoomsFocus(true)}
                  onBlur={() => setNoOfRoomsFocus(false)}
                />
                <p
                  id="noOfRoomsnote"
                  className={
                    noOfRoomsFocus && noOfRooms && !validNoOfRooms
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <br />
                  Must be number between 1 and 100
                </p>
                <p ref={errRef} className="inputErrMsg" aria-live="assertive">
                  {submitting && noOfRooms === ""
                    ? "This field is required"
                    : ""}
                </p>
              </div>
              <div className="formInput">
                <label>
                  Choose the hotel{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validHotel && hotel !== "" ? "valid" : "hide"}
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
                <select id="hotelId" onChange={handleChange}>
                  <option value="">Select hotel to Add the room to</option>
                  {loading
                    ? "loading"
                    : data.map((hotel) => {
                        return (
                          <option id={hotel._id} value={hotel._id}>
                            {hotel.name}
                          </option>
                        );
                      })}
                </select>
              </div>
              <button onClick={handleClick}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
