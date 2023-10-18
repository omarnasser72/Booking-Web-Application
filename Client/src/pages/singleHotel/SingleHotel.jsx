import "./singleHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
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
import useFetch from "../../hooks/useFetch";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { DataGrid } from "@mui/x-data-grid";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";

const HOTEL_REGEX = /^[A-Za-z0-9\s.'-]{3,}$/;
const CITY_REGEX = /^[A-Za-z\s.'-]{3,}$/;
const ADDRESS_REGEX = /^[A-Za-z0-9\s.,'()-]{5,}$/;
const DISTANCE_REGEX = /^[\d.]+ (km|mi)$/;
const TITLE_REGEX = /^[A-Za-z0-9\s.,'()-]{3,}$/;
const DESC_REGEX = /^.{10,500}$/;
const PRICE_REGEX = /^\d+(\.\d{2})?$/;
const COUNTRY_REGEX = /^[A-Za-z\s.'-]{3,}$/;
const allowedExtensions = /^[^.\/]+\.(jpg|jpeg|png|gif|bmp)$/i;

const SingleHotel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hotelId = location.pathname.split("/")[3];
  console.log(hotelId);
  const {
    data: hotel,
    loading,
    error,
    reFetch,
  } = useFetch(`/hotels/find/${hotelId}`);

  const [rooms, setRooms] = useState([]);
  const [slideNumber, setSlideNumber] = useState(0);
  const [isImgSliderOpen, setImgSlider] = useState(false);

  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [editMode, setEditMode] = useState(false);

  const hotelRef = useRef();
  const errRef = useRef();

  const [name, setHotelName] = useState("");
  const [validHotelName, setValidHotelName] = useState(false);
  const [hotelNameFocus, setHotelNameFocus] = useState(false);
  const [hotelNameExists, setHotelNameExists] = useState(false);

  const [city, setCity] = useState("");
  const [validCity, setValidCity] = useState(false);
  const [cityFocus, setCityFocus] = useState(false);

  const [address, setAddress] = useState("");
  const [validAddress, setValidAddress] = useState(false);
  const [addressFocus, setAddressFocus] = useState(false);

  const [distance, setDistance] = useState("");
  const [validDistance, setValidDistance] = useState(false);
  const [distanceFocus, setDistanceFocus] = useState(false);

  const [title, setTitle] = useState("");
  const [validTitle, setValidTitle] = useState(false);
  const [titleFocus, setTitleFocus] = useState(false);

  const [desc, setDesc] = useState("");
  const [validDesc, setValidDesc] = useState(false);
  const [descFocus, setDescFocus] = useState(false);

  const [cheapestPrice, setPrice] = useState("");
  const [validPrice, setValidPrice] = useState(false);
  const [priceFocus, setPriceFocus] = useState(false);

  const [country, setCountry] = useState("");
  const [validCountry, setValidCountry] = useState(false);
  const [countryFocus, setCountryFocus] = useState(false);

  const [type, setType] = useState("");
  const [validType, setValidType] = useState(false);
  const [typeFocus, setTypeFocus] = useState(false);

  const [featured, setFeatured] = useState("");
  const [validFeatured, setValidFeatured] = useState(false);
  const [featuredFocus, setFeaturedFocus] = useState(false);

  const [rating, setRating] = useState("");
  const [validRating, setValidRating] = useState(false);
  const [ratingFocus, setRatingFocus] = useState(false);

  const [imgUrl, setImgUrl] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const [currPhotos, setCurrPhotos] = useState(hotel ? hotel.photos : []);
  const [fetchHotelPhotos, setFetchHotelPhotos] = useState(true);
  const [sidebar, setSidebar] = useState(false);

  const roomColumns = [
    { field: "title", headerName: "Title", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "maxPeople", headerName: "Max People", width: 150 },
    { field: "desc", headerName: "Description", width: 300 },
  ];

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let roomsRows = [];
      if (hotel && hotel.rooms) {
        const roomsIDs = hotel.rooms;
        console.log(roomsIDs);
        if (roomsIDs.length > 0) {
          const roomsData = await Promise.all(
            roomsIDs.map(async (roomId) => {
              const roomReq = await axios.get(`/rooms/${roomId}`);
              if (roomReq.data) {
                roomsRows.push(roomReq.data);
              }
              return roomReq.data;
            })
          );
          setRooms([...roomsRows]);
        }
      }
    };
    fetchData();
  }, [hotel]);

  useEffect(() => {
    hotelRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(hotel);
    setHotelName(hotel.name);
    setTitle(hotel.title);
    setType(hotel.type);
    setCity(hotel.city);
    setCountry(hotel.country);
    setAddress(hotel.address);
    setDistance(hotel.distance);
    setDesc(hotel.desc);
    setPrice(hotel.cheapestPrice);
    setFeatured(hotel.featured);
    setRating(hotel.rating);
  }, [hotel]);

  useEffect(() => {
    console.log(name);
    setValidHotelName(HOTEL_REGEX.test(name));
  }, [name]);
  useEffect(() => {
    console.log(type);
    type !== "" ? setValidType(true) : setValidType(false);
    console.log(validType);
  }, [type]);

  useEffect(() => {
    console.log(city);
    setValidCity(CITY_REGEX.test(city));
  }, [city]);

  useEffect(() => {
    console.log(country);
    setValidCountry(COUNTRY_REGEX.test(country));
  }, [country]);

  useEffect(() => {
    console.log(address);
    setValidAddress(ADDRESS_REGEX.test(address));
  }, [address]);

  useEffect(() => {
    console.log(distance);
    setValidDistance(DISTANCE_REGEX.test(distance));
  }, [distance]);

  useEffect(() => {
    console.log(title);
    setValidTitle(TITLE_REGEX.test(title));
  }, [title]);

  useEffect(() => {
    console.log(desc);
    setValidDesc(DESC_REGEX.test(desc));
  }, [desc]);

  useEffect(() => {
    console.log(cheapestPrice);
    setValidPrice(PRICE_REGEX.test(cheapestPrice));
  }, [cheapestPrice]);

  useEffect(() => {
    console.log(featured);
    featured !== "" ? setValidFeatured(true) : setValidFeatured(false);
  }, [featured]);

  useEffect(() => {
    setErrMsg("");
    console.log(info);
    console.log(
      validHotelName,
      validTitle,
      validDesc,
      validCity,
      validCountry,
      validPrice,
      validDistance,
      validAddress,
      validType,
      validFeatured
    );
  }, [
    name,
    title,
    desc,
    city,
    country,
    cheapestPrice,
    desc,
    address,
    distance,
    type,
    featured,
  ]);

  useEffect(() => {
    if (errMsg === "Name Already exists") {
      setHotelNameExists(true);
      setValidHotelName(false);
    } else setHotelNameExists(false);
  }, [errMsg]);

  useEffect(() => {
    console.log(slideNumber);
  }, [slideNumber]);

  useEffect(() => {
    console.log(isImgSliderOpen);
  }, [isImgSliderOpen]);

  useEffect(() => {
    if (hotel && fetchHotelPhotos && currPhotos === undefined) {
      setCurrPhotos(hotel.photos);
      if (currPhotos !== undefined) setFetchHotelPhotos(false);
    }
  }, [hotel]);

  useEffect(() => {
    console.log(currPhotos);
  }, [currPhotos]);

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

  const handleChange = (e) => {
    if (e.target.id === "name") setHotelName(e.target.value);
    else if (e.target.id === "title") setTitle(e.target.value);
    else if (e.target.id === "desc") setDesc(e.target.value);
    else if (e.target.id === "cheapestPrice") setPrice(e.target.value);
    else if (e.target.id === "address") setAddress(e.target.value);
    else if (e.target.id === "city") setCity(e.target.value);
    else if (e.target.id === "country") setCountry(e.target.value);
    else if (e.target.id === "distance") setDistance(e.target.value);
    else if (e.target.id === "type") setType(e.target.value);
    else if (e.target.id === "featured") setFeatured(e.target.value);
    else if (e.target.id === "photo") setImgUrl(e.target.value);
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmission = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    if (
      !(
        validHotelName &&
        validTitle &&
        validAddress &&
        validCity &&
        validCountry &&
        validDesc &&
        validDistance &&
        validType &&
        validPrice &&
        validFeatured
      )
    ) {
      if (!validHotelName) setHotelNameFocus(true);
      if (!validTitle) setTitleFocus(true);
      if (!validAddress) setAddressFocus(true);
      if (!validCity) setCityFocus(true);
      if (!validCountry) setCountryFocus(true);
      if (!validDesc) setDescFocus(true);
      if (!validDistance) setDistanceFocus(true);
      if (!validType) setTypeFocus(true);
      if (!validPrice) setPriceFocus(true);
      if (!validFeatured) setFeaturedFocus(true);
    } else {
      try {
        const photos = Array.from(files).map((file) => file.name);
        console.log(photos);
        const newHotel = {
          ...hotel,
          ...info,
          photos: currPhotos,
        };
        console.log(newHotel);
        const res = await axios.put(`/hotels/${hotelId}`, newHotel);
        if (res.data.success === false) {
          setErrMsg("Adding new hotel wasn't successful");
        }
        navigate("/adminDashboard/hotels");
      } catch (error) {
        setErrMsg(error.response.data.message);
        console.log(error.response.data.message);
      }
    }
  };

  const handleOpenImgSlider = (index) => {
    setSlideNumber(index);
    setImgSlider(true);
    console.log(isImgSliderOpen);
  };

  const handleImgSliderMove = (direction) => {
    let newSlideNumber;
    if (hotel.photos && hotel.photos.length > 0) {
      if (direction === "l")
        newSlideNumber =
          slideNumber === 0 ? hotel.photos.length - 1 : slideNumber - 1;
      else
        newSlideNumber =
          slideNumber === hotel.photos.length - 1 ? 0 : slideNumber + 1;
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
                  src={
                    allowedExtensions.test(hotel.photos[slideNumber])
                      ? `${process.env.PUBLIC_URL}/upload/hotels/${hotel.photos[slideNumber]}`
                      : hotel.photos[slideNumber]
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
            <div className="loading">Loading Hotel info... </div>
          ) : error ? (
            <div className="loading">{error}</div>
          ) : !editMode ? (
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
                        <div className="detailItem">
                          <h2 className="itemTitle">{`${hotel.name}`}</h2>
                          <h5 className="itemSubTitle">{`${hotel.desc}`}</h5>
                        </div>
                        <div className="detailItem">
                          <span className="itemKey">Type:</span>
                          <span className="itemValue">{`${hotel.type}`}</span>
                        </div>
                        <div className="detailItem">
                          <span className="itemKey">Location:</span>
                          <span className="itemValue">{`${hotel.city}, ${hotel.country}`}</span>
                        </div>
                        <div className="detailItem">
                          <span className="itemKey">Address:</span>
                          <span className="itemValue">{`${hotel.address}`}</span>
                        </div>
                        <div className="detailItem">
                          <span className="itemKey">
                            Distance from Mentioned City:
                          </span>
                          <span className="itemValue">{`${hotel.distance}`}</span>
                        </div>
                        <div className="detailItem">
                          <span className="itemKey">Cheapest Room Price:</span>
                          <span className="itemValue">{`${hotel.cheapestPrice}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="itemImg">
                    {hotel.photos?.map((photo, index) => {
                      return (
                        <img
                          src={
                            allowedExtensions.test(photo)
                              ? `${process.env.PUBLIC_URL}/upload/hotels/${photo}`
                              : photo
                          }
                          alt=""
                          key={index}
                          onClick={() => handleOpenImgSlider(index)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="bottom">
                {hotel.rooms && (
                  <div className="table">
                    <DataGrid
                      className="dataGrid"
                      rows={rooms}
                      columns={roomColumns}
                      getRowId={(row) => row._id}
                    />
                  </div>
                )}
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
                                  ? `${process.env.PUBLIC_URL}/upload/hotels/${photo}`
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
                        Hotel Name:{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validHotelName ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validHotelName || (name === "" && !hotelNameFocus)
                              ? "hide"
                              : "invalid"
                          }
                        />
                      </label>
                      <input
                        type="text"
                        id="name"
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        value={name}
                        onFocus={() => setHotelNameFocus(true)}
                        onBlur={() => setHotelNameFocus(false)}
                        aria-invalid={validHotelName ? "false" : "true"}
                        aria-describedby="uidnote"
                      />
                      <p
                        id="uidnote"
                        className={
                          hotelNameFocus && name && !validHotelName
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <br />
                        at least 3 characters.
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
                        {hotelNameExists ? errMsg : ""}
                        {submitting && name === ""
                          ? "This field is required"
                          : ""}
                      </p>
                    </div>
                    <div className="eachInput">
                      <label htmlFor="type">
                        Type :{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validType && type ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={!validType && type ? "invalid" : "hide"}
                        />
                      </label>
                      <select
                        id="type"
                        onChange={handleChange}
                        onFocus={() => setTypeFocus(true)}
                        value={type}
                      >
                        <option value="">Select Type</option>
                        <option value="hotel">Hotel</option>
                        <option value="apartment">Apartment</option>
                        <option value="resort">Resort</option>
                        <option value="villa">Villa</option>
                        <option value="cabin">Cabin</option>
                      </select>
                    </div>
                    <div className="eachInput">
                      <label htmlFor="title">
                        Title :{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validTitle && title ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={!validTitle && title ? "invalid" : "hide"}
                        />
                      </label>
                      <input
                        type="text"
                        id="title"
                        onChange={handleChange}
                        required
                        value={title}
                        aria-invalid={validTitle ? "false" : "true"}
                        aria-describedby="titlenote"
                        onFocus={() => setTitleFocus(true)}
                        onBlur={() => setTitleFocus(false)}
                      />
                      <p
                        id="uidnote"
                        className={
                          titleFocus && title && !validTitle
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <br />
                        at least 3 characters.
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
                        {submitting && title === ""
                          ? "This field is required"
                          : ""}
                      </p>
                    </div>
                    <div className="eachInput">
                      <label htmlFor="desc">
                        Description:{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validDesc ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validDesc || (!desc && !descFocus)
                              ? "hide"
                              : "invalid"
                          }
                        />
                      </label>
                      <input
                        type="text"
                        id="desc"
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        value={desc}
                        onFocus={() => setDescFocus(true)}
                        onBlur={() => setDescFocus(false)}
                        aria-invalid={validDesc ? "false" : "true"}
                        aria-describedby="uidnote"
                      />
                      <p
                        id="uidnote"
                        className={
                          descFocus && desc && !validDesc
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <br />
                        at least 10 characters.
                        <br />
                        at most 500 characters
                      </p>
                      <p
                        ref={errRef}
                        className="inputErrMsg"
                        aria-live="assertive"
                      >
                        {submitting && desc === ""
                          ? "This field is required"
                          : ""}
                      </p>
                    </div>
                    <div className="eachInput">
                      <label htmlFor="address">
                        Address:{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validAddress && address ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validAddress || (!address && !addressFocus)
                              ? "hide"
                              : "invalid"
                          }
                        />
                      </label>
                      <input
                        type="text"
                        id="address"
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        value={address}
                        onFocus={() => setAddressFocus(true)}
                        onBlur={() => setAddressFocus(false)}
                        aria-invalid={validHotelName ? "false" : "true"}
                        aria-describedby="uidnote"
                      />
                      <p
                        id="uidnote"
                        className={
                          addressFocus && address && !validAddress
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <br />
                        at least 5 characters.
                        <br />
                        Letters, numbers, underscores, hyphens allowed.
                      </p>
                      <p
                        ref={errRef}
                        className="inputErrMsg"
                        aria-live="assertive"
                      >
                        {submitting && address === ""
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
                      <label htmlFor="distance">
                        Distance:{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validDistance ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validDistance || (!distance && !distanceFocus)
                              ? "hide"
                              : "invalid"
                          }
                        />
                      </label>
                      <input
                        type="text"
                        id="distance"
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        value={distance}
                        onFocus={() => setDistanceFocus(true)}
                        onBlur={() => setDistanceFocus(false)}
                        aria-invalid={validDistance ? "false" : "true"}
                        aria-describedby="uidnote"
                      />
                      <p
                        id="uidnote"
                        className={
                          distanceFocus && distance && !validDistance
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <br />
                        at least a number.
                        <br />
                        Must end with km or mi.
                        <br />
                        numbers only are allowed.
                      </p>
                      <p
                        ref={errRef}
                        className="inputErrMsg"
                        aria-live="assertive"
                      >
                        {submitting && distance === ""
                          ? "This field is required"
                          : ""}
                      </p>
                    </div>
                    <div className="eachInput">
                      <label htmlFor="cheapestPrice">
                        Cheapest Room's Price:{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validPrice ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validPrice || (!cheapestPrice && !priceFocus)
                              ? "hide"
                              : "invalid"
                          }
                        />
                      </label>
                      <input
                        type="text"
                        id="cheapestPrice"
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        value={cheapestPrice}
                        onFocus={() => setPriceFocus(true)}
                        onBlur={() => setPriceFocus(false)}
                        aria-invalid={validPrice ? "false" : "true"}
                        aria-describedby="uidnote"
                      />
                      <p
                        id="uidnote"
                        className={
                          priceFocus && cheapestPrice && !validPrice
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <br />
                        at least a number.
                        <br />
                        numbers and dots are allowed.
                      </p>
                      <p
                        ref={errRef}
                        className="inputErrMsg"
                        aria-live="assertive"
                      >
                        {submitting && distance === ""
                          ? "This field is required"
                          : ""}
                      </p>
                    </div>
                    <div className="eachInput">
                      <label>
                        Featured{" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={
                            validFeatured && featured !== "" ? "valid" : "hide"
                          }
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validFeatured || (featured === "" && !featuredFocus)
                              ? "hide"
                              : "invalid"
                          }
                        />
                      </label>
                      <select id="featured" onChange={handleChange}>
                        <option value="">Select featured Option</option>
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                      </select>
                    </div>

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

export default SingleHotel;
