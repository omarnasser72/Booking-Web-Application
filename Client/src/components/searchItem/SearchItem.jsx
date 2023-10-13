import { Link } from "react-router-dom";
import "./searchItem.css";
import { useState, useEffect } from "react";
const allowedExtensions = /^[^.\/]+\.(jpg|jpeg|png|gif|bmp)$/i;

const SearchItem = ({ item }) => {
  const [rateCategory, setRateCategory] = useState("");

  useEffect(() => {
    handleRateCategory(item.rating);
  }, [item.rating]);

  const handleRateCategory = (rate) => {
    if (rate <= 1) setRateCategory("Bad");
    else if (rate <= 2) setRateCategory("Poor");
    else if (rate <= 3) setRateCategory("Fair");
    else if (rate <= 4) setRateCategory("Good");
    else if (rate <= 5) setRateCategory("Excellent");
  };

  return (
    <div className="searchItem">
      <img
        src={
          allowedExtensions.test(item.photos[0])
            ? `${process.env.PUBLIC_URL}/upload/hotels/${item.photos[0]}`
            : item.photos[0]
        }
        alt=""
        className="searchItemImg"
      />
      <div className="searchItemDesc">
        <h1 className="searchItemTitle">{item.name}</h1>
        <span className="searchItemDistance">
          {item.distance} km from centre
        </span>
        <span className="searchItemTaxiOption">free airport taxi</span>
        <span className="searchItemSubtitle">Studio apartment</span>
        <span className="searchItemFeatures">{item.desc}</span>
        <span className="searchItemCancelOption">not free</span>
        <span className="searchItemCancelOptionSubtitle">
          You will be fined 5$
        </span>
      </div>
      <div className="searchItemDetails">
        {item.rating ? (
          <div className="searchItemRating">
            <span> {rateCategory}</span>
            <button>{item.rating}</button>
          </div>
        ) : (
          ""
        )}
        <div className="searchItemDetailsText">
          <span className="searchItemPrice">${item.cheapestPrice}</span>
          <span className="searchItemDetailsTaxiOption">
            doesn't include taxes and fees
          </span>
          <Link to={`/hotels/${item._id}`}>
            <button className="searchItemCheckBtn">See Availability</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
