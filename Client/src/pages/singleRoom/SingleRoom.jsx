import "./singleRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "../../axios";
import useFetch from "../../hooks/useFetch";
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
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";

const ROOM_TITLE_REGEX = /^[A-Za-z0-9\s.'-]{3,}$/;
const ROOM_DESCRIPTION_REGEX = /^.{10,500}$/;
const ROOM_PRICE_REGEX = /^\d+(\.\d{2})?$/;
const MAX_PEOPLE_REGEX = /^(?:[1-9]|10)$/;
const NUMBER_OF_ROOMS_REGEX = /^([1-9]|[1-9][0-9]|100)$/;
const allowedExtensions = /^[^.\/]+\.(jpg|jpeg|png|gif|bmp)$/i;

const SingleRoom = () => {
  const location = useLocation();
  const roomId = location.pathname.split("/")[3];
  console.log(roomId);
  const [sidebar, setSidebar] = useState(false);
  const { data: room, loading, error } = useFetch(`/rooms/${roomId}`);
  const [currPhotos, setCurrPhotos] = useState(room ? room.images : []);
  const [slideNumber, setSlideNumber] = useState(0);
  const [isImgSliderOpen, setImgSlider] = useState(false);
  const [isPhotosRetrieved, setIsRetrivedPhotos] = useState(false);

  const [info, setInfo] = useState({});
  const [files, setFiles] = useState("");
  const [rooms, setRooms] = useState();
  const [addedRooms, setAddedRooms] = useState("");
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);

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
  const [minNoOfRooms, setMinNoOfRooms] = useState(
    room.length > 0 ? room.roomNumbers.length - 1 : -1
  );

  const [imgUrl, setImgUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    roomRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(room);
    setRoomTitle(room.title);
    setRoomDesc(room.desc);
    setRoomMaxPeople(room.maxPeople);
    setRoomPrice(room.price);
    setNoOfRooms(room.roomNumbers?.length - 1);
    setRooms(room.roomNumbers);
    console.log(isPhotosRetrieved);
    if (!isPhotosRetrieved) {
      if (room) {
        console.log(room.images);
        setCurrPhotos(room.images);
        if (currPhotos !== undefined) setIsRetrivedPhotos(true);
      }
    }
    if (room !== undefined && room.length > 0)
      setMinNoOfRooms(room.roomNumbers.length - 1);

    console.log(minNoOfRooms);
  }, [room]);

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
    if (noOfRooms && minNoOfRooms === -1) {
      setMinNoOfRooms(noOfRooms - 1);
    }
  }, [noOfRooms]);

  useEffect(() => {
    console.log(rooms);
  }, [rooms]);

  useEffect(() => {
    setErrMsg("");
    console.log(info);
    console.log(
      validNoOfRooms,
      validRoomDesc,
      validRoomMaxPeople,
      validRoomPrice,
      validRoomTitle
    );
  }, [noOfRooms, roomDesc, roomMaxPeople, roomPrice, roomTitle]);

  useEffect(() => {
    let fileNames = [];
    console.log(files);
    if (files) {
      for (let i = 0; i < files.length; i++) fileNames.push(files[i].name);
    }
    console.log(fileNames);
    if (fileNames.length > 0)
      setCurrPhotos((currPhotos) => currPhotos.concat(fileNames));
  }, [files]);

  useEffect(() => {
    console.log(currPhotos);
  }, [currPhotos]);

  const handleChange = (e) => {
    if (e.target.id === "title") setRoomTitle(e.target.value);
    else if (e.target.id === "desc") setRoomDesc(e.target.value);
    else if (e.target.id === "price") setRoomPrice(e.target.value);
    else if (e.target.id === "maxPeople") setRoomMaxPeople(e.target.value);
    else if (e.target.id === "photo") setImgUrl(e.target.value);

    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    console.log(info);
  };

  const generateRoomNumbers = (e) => {
    const numbers = e.target.value;
    console.log(numbers);
    const roomNumbers = [];
    console.log(room.roomNumbers.length);
    for (let i = room.roomNumbers.length; i <= numbers; i++) {
      roomNumbers.push(i);
    }
    setNoOfRooms(numbers);
    setAddedRooms(roomNumbers);
    console.log(addedRooms);
    //setRooms(roomNumbers);
  };

  useEffect(() => {
    console.log(slideNumber);
  }, [slideNumber]);

  useEffect(() => {
    console.log(isImgSliderOpen);
  }, [isImgSliderOpen]);

  useEffect(() => {
    console.log(allowedExtensions.test("pexels-pixabay-262048.jpg"));
  }, []);

  const handleOpenImgSlider = (index) => {
    setSlideNumber(index);
    console.log(slideNumber);
    setImgSlider(true);
    console.log(isImgSliderOpen);
  };

  const handleImgSliderMove = (direction) => {
    let newSlideNumber;
    if (room.images && room.images.length > 0) {
      if (direction === "l")
        newSlideNumber =
          slideNumber === 0 ? room.images.length - 1 : slideNumber - 1;
      else
        newSlideNumber =
          slideNumber === room.images.length - 1 ? 0 : slideNumber + 1;
      setSlideNumber(newSlideNumber);
    }
  };
  const handleRemoveImg = (selectedPhoto) => {
    const updatedPhotos = currPhotos.filter((photo) => photo !== selectedPhoto);
    setCurrPhotos(updatedPhotos);
    console.log(currPhotos);
  };

  const handleImgUrl = (e) => {
    e.preventDefault();
    if (imgUrl.length > 0)
      setCurrPhotos((currPhotos) => currPhotos.concat(imgUrl));
    setImgUrl("");
  };

  const handleSubmission = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    if (
      !(
        //validHotel &&
        //validNoOfRooms &&
        (
          validRoomDesc &&
          validRoomMaxPeople &&
          validRoomPrice &&
          validRoomTitle
        )
      )
    ) {
      //if (!validHotel) setHotelFocus(true);
      //if (!validNoOfRooms) setNoOfRoomsFocus(true);
      if (!validRoomDesc) setRoomDescFocus(true);
      if (!validRoomMaxPeople) setRoomMaxPeopleFocus(true);
      if (!validRoomPrice) setRoomPriceFocus(true);
      if (!validRoomTitle) setRoomTitleFocus(true);
    } else {
      try {
        console.log(addedRooms === "");

        const addedRoomNumbers =
          addedRooms !== ""
            ? addedRooms.map((roomNo) => ({
                number: roomNo,
                ununavailableDates: [],
              }))
            : "";
        const roomNumbers = rooms.concat(addedRoomNumbers);
        console.log(roomNumbers);
        console.log(files);
        const updatedRoom = {
          ...room,
          ...info,
          images: currPhotos,
          roomNumbers,
        };
        await axios.put(`/rooms/${roomId}`, updatedRoom);
        navigate("/adminDashboard/rooms");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="single">
      <div className="wrapper">
        {sidebar && !isImgSliderOpen && <Sidebar />}
        <div className="singleContainer">
          <div className="sideNavbars">
            <div className="sidebarBtn">
              <button onClick={() => setSidebar(!sidebar)}>
                <ListOutlinedIcon className="icon" />
              </button>
            </div>
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
                  src={
                    allowedExtensions.test(room.images[slideNumber])
                      ? `${process.env.PUBLIC_URL}/upload/rooms/${room.images[slideNumber]}`
                      : room.images[slideNumber]
                  }
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
            <div className="loading">Loading Room info... </div>
          ) : error ? (
            <div className="loading">{error}</div>
          ) : !editMode ? (
            <div className="infoWrapper">
              <div className="info">
                <button className="editBtn" onClick={() => setEditMode(true)}>
                  Edit
                </button>
                <h4 className="title">Information</h4>
                <div className="item">
                  <div className="left">
                    {room.images?.map((image, i) => {
                      return (
                        <div className="roomImage" key={i}>
                          {image && (
                            <img
                              onClick={() => handleOpenImgSlider(i)}
                              src={
                                allowedExtensions.test(image)
                                  ? `${process.env.PUBLIC_URL}/upload/rooms/${image}`
                                  : image
                              }
                              alt=""
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="right">
                    <div className="details">
                      <h2 className="itemTitle">Room Type: {room.title}</h2>
                      <h5 className="itemSubTitle">Description: {room.desc}</h5>
                      <div className="detailItem">
                        <span className="itemKey">Max People:</span>
                        <span className="itemValue">{room.maxPeople}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Room's price per Night:</span>
                        <span className="itemValue">{room.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="infoWrapperEditMode">
              <h4 className="title">Information</h4>
              <div className="top">
                <div className="left">
                  <div className="images">
                    {currPhotos &&
                      currPhotos.map((photo, index) => {
                        return (
                          <div className="eachImg" key={index}>
                            <img
                              src={
                                allowedExtensions.test(photo)
                                  ? `${process.env.PUBLIC_URL}/upload/rooms/${photo}`
                                  : photo
                              }
                              alt=""
                              key={index}
                              onClick={() => handleOpenImgSlider(index)}
                            />
                            <div
                              className="removeIcon"
                              onClick={() => handleRemoveImg(photo)}
                            >
                              <FontAwesomeIcon icon={faCircleXmark} />
                            </div>
                          </div>
                        );
                      })}
                    <label htmlFor="file" style={{ cursor: "pointer" }}>
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
                  <div className="uploadUrl">
                    <input
                      id="photo"
                      type="text"
                      value={imgUrl}
                      onChange={handleChange}
                    />
                    <button className="uploadImage" onClick={handleImgUrl}>
                      Upload
                    </button>
                  </div>
                </div>
                <div className="right">
                  <form>
                    <div className="eachInput">
                      <label htmlFor="name">
                        Room Name:{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validRoomTitle ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validRoomTitle ||
                            (roomTitle === "" && !roomTitleFocus)
                              ? "hide"
                              : "invalid"
                          }
                        />
                      </label>
                      <input
                        type="text"
                        id="title"
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        value={roomTitle}
                        onFocus={() => setRoomTitleFocus(true)}
                        onBlur={() => setRoomTitleFocus(false)}
                        aria-invalid={validRoomTitle ? "false" : "true"}
                        aria-describedby="uidnote"
                      />
                      <p
                        id="uidnote"
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
                        Allow letters (uppercase and lowercase), numbers,
                        spaces, dots, single quotes, and hyphens.
                      </p>
                      <p
                        ref={errRef}
                        className="inputErrMsg"
                        aria-live="assertive"
                      >
                        {submitting && roomTitle === ""
                          ? "This field is required"
                          : ""}
                      </p>
                    </div>
                    <div className="eachInput">
                      <label htmlFor="type">
                        Description :{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={
                            validRoomDesc && roomDesc ? "valid" : "hide"
                          }
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            !validRoomDesc && roomDesc ? "invalid" : "hide"
                          }
                        />
                      </label>
                      <input
                        type="text"
                        id="desc"
                        value={roomDesc}
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
                        Allow any character, including spaces and special
                        characters.
                      </p>
                      <p
                        ref={errRef}
                        className="inputErrMsg"
                        aria-live="assertive"
                      >
                        {submitting && roomDesc === ""
                          ? "This field is required"
                          : ""}
                      </p>
                    </div>
                    <div className="eachInput">
                      <label>
                        Room's Price:{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validRoomPrice ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validRoomPrice ||
                            (roomPrice === "" && !roomPriceFocus)
                              ? "hide"
                              : "invalid"
                          }
                        />
                      </label>
                      <input
                        type="text"
                        id="price"
                        value={roomPrice}
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
                      <p
                        ref={errRef}
                        className="inputErrMsg"
                        aria-live="assertive"
                      >
                        {submitting && roomPrice === ""
                          ? "This field is required"
                          : ""}
                      </p>
                    </div>
                    <div className="eachInput">
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
                            (roomMaxPeople === "" && !roomMaxPeopleFocus)
                              ? "hide"
                              : "invalid"
                          }
                        />
                      </label>
                      <input
                        type="text"
                        id="maxPeople"
                        value={roomMaxPeople}
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
                          roomMaxPeopleFocus &&
                          roomMaxPeople &&
                          !validRoomMaxPeople
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <br />
                        Must be a number between 1 and 10
                      </p>
                      <p
                        ref={errRef}
                        className="inputErrMsg"
                        aria-live="assertive"
                      >
                        {submitting && roomMaxPeople === ""
                          ? "This field is required"
                          : ""}
                      </p>
                    </div>

                    {minNoOfRooms !== -1 ? (
                      <div className="eachInput">
                        <label>
                          Number of Rooms{" "}
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={
                              validNoOfRooms && noOfRooms !== ""
                                ? "valid"
                                : "hide"
                            }
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={
                              validNoOfRooms ||
                              (noOfRooms === "" && !noOfRoomsFocus)
                                ? "hide"
                                : "invalid"
                            }
                          />
                        </label>
                        <input
                          type="number"
                          id="roomNumber"
                          min={minNoOfRooms}
                          onChange={generateRoomNumbers}
                          value={noOfRooms}
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
                        <p
                          ref={errRef}
                          className="inputErrMsg"
                          aria-live="assertive"
                        >
                          {submitting && noOfRooms === ""
                            ? "This field is required"
                            : ""}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="btns">
                      <button className="updateBtn" onClick={handleSubmission}>
                        Update
                      </button>
                      <button
                        className="cancelBtn"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                    </div>
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

export default SingleRoom;
