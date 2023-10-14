import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./featuredProperties.css";
import api from "../../api.js";

const FeaturedProperties = () => {
  const { data, loading } = useFetch(`/hotels?featured=true&max=3`);
  const navigate = useNavigate();
  const handleClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };
  return (
    <div className="fb">
      {loading ? (
        "loading"
      ) : (
        <>
          {data.map((item) => (
            <div
              className="fbItem"
              key={item._id}
              onClick={() => handleClick(item._id)}
            >
              <img src={item.photos[0]} alt={item.title} className="fbImg" />
              <span className="fbName">{item.name}</span>
              <span className="fbCity">{item.city}</span>
              <span className="fbPrice">starts from {item.cheapestPrice}$</span>
              {item.rating && (
                <div className="fbRating">
                  <button className="fbRatingBtn">{item.rating}</button>
                  <span>good</span>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;
