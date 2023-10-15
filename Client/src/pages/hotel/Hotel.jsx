import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/Reserve/Reserve";
import { Rating } from "@mui/material";
import axios from "axios";
const allowedExtensions = /^[^.\/]+\.(jpg|jpeg|png|gif|bmp)$/i;

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  console.log(id);
  const navigate = useNavigate();
  const [slideNumber, setSlideNumber] = useState(0);
  const [isImgSliderOpen, setImgSlider] = useState(false);
  const [openBook, setOpenBook] = useState(false);
  const {
    data: hotel,
    loading,
    error,
    reFetch,
  } = useFetch(`/hotels/find/${id}`);
  console.log(hotel);
  const [rate, setRate] = useState();
  const [openRate, setOpenRate] = useState(false);

  const handleOpenImgSlider = (index) => {
    setSlideNumber(index);
    setImgSlider(true);
  };

  const handleImgSliderMove = (direction) => {
    let newSlideNumber;
    if (direction === "l")
      newSlideNumber =
        slideNumber === 0 ? hotel.photos.length - 1 : slideNumber - 1;
    else
      newSlideNumber =
        slideNumber === hotel.photos.length - 1 ? 0 : slideNumber + 1;

    setSlideNumber(newSlideNumber);
  };
  const { date } = useContext(SearchContext);
  console.log(date);
  const { user } = useContext(AuthContext);
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  function dayDifference(startDate, endDate) {
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  const days =
    date[0].startDate !== undefined
      ? Math.max(1, dayDifference(date[0].startDate, date[0].endDate))
      : 1;
  console.log(date);

  const handleReserve = () => {
    user ? navigate(`/hotels/reservation/${id}`) : navigate("/auth/login");
  };

  const handleSubmitRate = () => {
    setOpenRate(false);
    reFetch();
  };

  useEffect(() => {
    try {
      const update = async () => {
        const rateObj = {
          hotelId: hotel._id,
          userId: user._id,
          rating: rate,
        };
        if (hotel._id && user._id) {
          await axios.post(
            `https://booking-fwaz.onrender.com/rates/${user._id}/${hotel._id}`,
            rateObj
          );
          console.log(
            await axios.post(
              `https://booking-fwaz.onrender.com/rates/${user._id}/${hotel._id}`,
              rateObj
            )
          );
        }
      };
      update();
      //reFetch();
    } catch (error) {
      console.log(error);
    }
  }, [rate]);

  useEffect(() => {
    console.log(rate);
  }, [rate]);

  useEffect(() => {
    console.log(allowedExtensions.test("pexels-jonas-togo-2907196.jpg"));
  }, []);

  return (
    <div className="Hotel">
      <div className="wholePage">
        <Navbar />
        <Header type="list" />
        {error ? (
          error
        ) : loading ? (
          "loading"
        ) : (
          <div className="hotelContainer">
            {isImgSliderOpen && (
              <div className="slider">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="closeImgSlider"
                  onClick={() => setImgSlider(false)}
                />
                <FontAwesomeIcon
                  icon={faCircleArrowLeft}
                  className="arrow"
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
                  className="arrow"
                  onClick={() => handleImgSliderMove("r")}
                />
              </div>
            )}
            {openRate && (
              <div
                className="rateContainer"
                //style={{ backgroundColor: "#52525280" }}
              >
                <div className="rateWrapper">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="closeRate"
                    onClick={() => setOpenRate(false)}
                  />
                  <span>Rate This Hotel</span>
                  <p>Share your experience with others</p>
                  <Rating
                    onChange={(e) => setRate(e.target.value)}
                    precision={0.5}
                  />
                  <br />
                  <button className="submitRate" onClick={handleSubmitRate}>
                    Submit
                  </button>
                </div>
              </div>
            )}
            <div className="hotelWrapper">
              <button className="rateBtn" onClick={() => setOpenRate(true)}>
                Rate
              </button>
              <h1 className="hotelTitle">{hotel.name}</h1>
              <div className="ratings">
                <Rating readOnly={true} value={hotel.rating} precision={0.5} />
              </div>
              <div className="hotelAddress">
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{hotel.address}</span>
              </div>
              <span className="hotelDistance">
                Excellent location – {hotel.distance}m from center
              </span>
              <span className="hotelPriceHighlight">
                Book a stay over ${hotel.cheapestPrice} at this property
              </span>
              <div className="hotelImages">
                {hotel.photos?.map((photo, i) => (
                  <div className="hotelImageWrapper" key={i}>
                    <img
                      onClick={() => handleOpenImgSlider(i)}
                      src={
                        allowedExtensions.test(photo)
                          ? `${process.env.PUBLIC_URL}/upload/hotels/${photo}`
                          : photo
                      }
                      alt=""
                      className="hotelImg"
                    />
                  </div>
                ))}
              </div>
              <div className="hotelDetails">
                <div className="hotelDetailText">
                  <h1 className="hotelTitle">{hotel.title}</h1>
                  <p className="hotelDesc">{hotel.desc}</p>
                </div>
                <div className="hotelDetailsPrice">
                  <h1>Perfect for a {days}-night stay!</h1>
                  <span>
                    Located in the real heart of Krakow, this property has an
                    excellent location score of 9.8!
                  </span>
                  <h2>
                    <b>${days * hotel.cheapestPrice}</b> ({days} nights)
                  </h2>
                  <button onClick={handleReserve}>Book Now</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <MailList />
        <Footer />
      </div>
      {openBook && <Reserve setOpen={setOpenBook} hotelId={id} />}
    </div>
  );
};

export default Hotel;
