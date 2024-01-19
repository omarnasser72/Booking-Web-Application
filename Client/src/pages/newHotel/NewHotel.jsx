import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faCircleXmark,
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavbarAdmin from "../../components/navbarAdmin/NavbarAdmin";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import org_axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const HOTEL_REGEX = /^[A-Za-z0-9\s.'-]{3,}$/;
const CITY_REGEX = /^[A-Za-z\s.'-]{3,}$/;
const ADDRESS_REGEX = /^[A-Za-z0-9\s.,'()-]{5,}$/;
const DISTANCE_REGEX = /^[\d.]+ (km|mi)$/;
const TITLE_REGEX = /^[A-Za-z0-9\s.,'()-]{3,}$/;
const DESC_REGEX = /^.{10,500}$/;
const PRICE_REGEX = /^\d+(\.\d{2})?$/;
const COUNTRY_REGEX = /^[A-Za-z\s.'-]{3,}$/;

const NewHotel = () => {
  const { accessToken } = useContext(AuthContext);
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});

  const [slideNumber, setSlideNumber] = useState(0);
  const [isImgSliderOpen, setImgSlider] = useState(false);

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

  const [errMsg, setErrMsg] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [imgUrl, setImgUrl] = useState("");
  const [currImgs, setCurrImgs] = useState([]);
  const uploadedUrls = [];
  const [uploading, setUploading] = useState(false);
  const [excceded, setExceeded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    hotelRef.current?.focus();
  }, []);

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
    if (errMsg === "Hotel Name Already exists") {
      setHotelNameExists(true);
      setValidHotelName(false);
    } else setHotelNameExists(false);
  }, [errMsg]);

  useEffect(() => {
    console.log(files);
    setExceeded(false);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 1024 * 1024) setExceeded(true);
        else setCurrImgs((currPhotos) => currPhotos.concat(files[i]));
      }
    }
  }, [files]);

  useEffect(() => {
    console.log("currImgs:", currImgs);
  }, [currImgs]);

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

  const handleRemoveImg = (selectedPhoto) => {
    const updatedPhotos = currImgs.filter((photo) => photo !== selectedPhoto);
    setCurrImgs(updatedPhotos);
    console.log(currImgs);
  };

  const handleOpenImgSlider = (index) => {
    setSlideNumber(index);
    setImgSlider(true);
    console.log(isImgSliderOpen);
  };

  const handleImgSliderMove = (direction) => {
    let newSlideNumber;
    if (currImgs?.length > 0) {
      if (direction === "l")
        newSlideNumber =
          slideNumber === 0 ? currImgs.length - 1 : slideNumber - 1;
      else
        newSlideNumber =
          slideNumber === currImgs.length - 1 ? 0 : slideNumber + 1;
      setSlideNumber(newSlideNumber);
    }
  };

  const handleImgUrl = (e) => {
    e.preventDefault();
    if (imgUrl.length > 0) setCurrImgs((prev) => [...prev, imgUrl]);
    setImgUrl("");
  };

  const handleUpload = async () => {
    if (!excceded) {
      setUploading(true);
      console.log("uploading....");
      try {
        for (let i = 0; i < currImgs.length; i++) {
          if (currImgs[i] instanceof File) {
            const data = new FormData();
            data.append("file", currImgs[i]);
            data.append("upload_preset", "upload");
            const uploadRes = await org_axios.post(
              "https://api.cloudinary.com/v1_1/omarnasser/upload",
              data
            );
            console.log(currImgs[i], " uploaded");
            console.log(uploadRes?.data?.url);
            uploadedUrls.push(uploadRes?.data?.url);
          } else {
            uploadedUrls.push(currImgs[i]);
          }
        }
        setUploading(false);
        console.log("uploaded successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClick = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    if (
      !(
        validHotelName &&
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
        if (files) await handleUpload();
        const { photo } = info;
        const newHotel = {
          ...info,
          photos: uploadedUrls,
        };
        console.log(newHotel);
        const res = await axios.post("/hotels", newHotel, {
          headers: { accessToken: accessToken },
        });
        if (res.data.success === false) {
          setErrMsg("Adding new hotel wasn't successful");
        }
        navigate("/adminDashboard/hotels");
      } catch (error) {
        setErrMsg(error.response.data.message);
        console.log(error);
      }
    }
  };
  return (
    <div className="newHotel">
      {isImgSliderOpen ? (
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
                currImgs[slideNumber] instanceof File
                  ? URL.createObjectURL(currImgs[slideNumber])
                  : currImgs[slideNumber]
              }
              className="sliderImg"
            />
          </div>
          <FontAwesomeIcon
            icon={faCircleArrowRight}
            className="rightArrow"
            onClick={() => handleImgSliderMove("r")}
          />
        </div>
      ) : (
        <>
          {sidebar && <Sidebar />}
          <div className="newContainer">
            <div className="sidebarWrapper">
              <div className="sidebarBtn">
                <button
                  className="listOutBtn"
                  onClick={() => setSidebar(!sidebar)}
                >
                  <ListOutlinedIcon className="icon" />
                </button>
              </div>
              <NavbarAdmin />
            </div>
            {uploading ? (
              <div className="uploading">
                <img
                  className="uploadHotelIcon"
                  src="https://media.tenor.com/hQz0Kl373E8AAAAj/loading-waiting.gif"
                />
                <label>adding Hotel </label>
              </div>
            ) : (
              <>
                <div className="top">
                  <h3>Add New Hotel</h3>
                </div>
                <div className="bottom">
                  <div className="left">
                    <div className="images">
                      {currImgs?.map((photo, index) => {
                        return (
                          <div className="eachImg" key={index}>
                            <img
                              src={
                                photo instanceof File
                                  ? URL.createObjectURL(photo)
                                  : photo
                              }
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
                      {excceded && (
                        <div className="exceededMsg">
                          Please, select Img size less than 1 MB to be uploaded
                        </div>
                      )}
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
                    {/* <div className="upload">
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
            </div> */}
                  </div>
                  <div className="right">
                    <form action="">
                      <div className="formInput">
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
                      <div className="formInput">
                        <label htmlFor="title">
                          Title:{" "}
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={validTitle ? "valid" : "hide"}
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={
                              validTitle || (!title && !titleFocus)
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
                          onFocus={() => setTitleFocus(true)}
                          onBlur={() => setTitleFocus(false)}
                          aria-invalid={validTitle ? "false" : "true"}
                          aria-describedby="uidnote"
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
                      <div className="formInput">
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
                      <div className="formInput">
                        <label htmlFor="address">
                          Address:{" "}
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={
                              validAddress && address ? "valid" : "hide"
                            }
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
                      <div className="formInput">
                        <label htmlFor="city">
                          city:{" "}
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={validCity ? "valid" : "hide"}
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={
                              validCity || (!city && !cityFocus)
                                ? "hide"
                                : "invalid"
                            }
                          />
                        </label>
                        <input
                          type="text"
                          id="city"
                          onChange={handleChange}
                          autoComplete="off"
                          required
                          onFocus={() => setCityFocus(true)}
                          onBlur={() => setCityFocus(false)}
                          aria-invalid={validCity ? "false" : "true"}
                          aria-describedby="uidnote"
                        />
                        <p
                          id="uidnote"
                          className={
                            cityFocus && city && !validCity
                              ? "instructions"
                              : "offscreen"
                          }
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                          <br />
                          at least 3 characters.
                          <br />
                          Only Letters allowed.
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
                        <label htmlFor="country">
                          Country:{" "}
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={validCountry ? "valid" : "hide"}
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={
                              validCountry || (!country && !countryFocus)
                                ? "hide"
                                : "invalid"
                            }
                          />
                        </label>
                        <input
                          type="text"
                          id="country"
                          onChange={handleChange}
                          autoComplete="off"
                          required
                          onFocus={() => setCountryFocus(true)}
                          onBlur={() => setCountryFocus(false)}
                          aria-invalid={validCountry ? "false" : "true"}
                          aria-describedby="uidnote"
                        />
                        <p
                          id="uidnote"
                          className={
                            countryFocus && country && !validCountry
                              ? "instructions"
                              : "offscreen"
                          }
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                          <br />
                          at least 3 characters.
                          <br />
                          Only Letters allowed.
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
                      <div className="formInput">
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
                      <div className="formInput">
                        <label>
                          Type{" "}
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={
                              validType && type !== "" ? "valid" : "hide"
                            }
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={
                              validType || (type === "" && !typeFocus)
                                ? "hide"
                                : "invalid"
                            }
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
                      <div className="formInput">
                        <label>
                          Featured{" "}
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={
                              validFeatured && featured !== ""
                                ? "valid"
                                : "hide"
                            }
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={
                              validFeatured ||
                              (featured === "" && !featuredFocus)
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
                      {!uploading && (
                        <button onClick={handleClick}>Submit</button>
                      )}
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default NewHotel;
