import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./featured.css";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext.js";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "https://booking-fwaz.onrender.com/hotels/countByCity?cities=cairo,giza,alexandria,aswan"
  );
  const location = useLocation();
  console.log(location);

  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const { dispatch } = useContext(SearchContext);

  const handleProperty = (d) => {
    console.log(d);
    setDestination(d);

    console.log(destination);
    console.log(date);
    console.log(options);

    dispatch({
      type: "NEW_SEARCH",
      payload: { destination: d, date, options },
    });
    navigate("/hotels", { state: { destination: d, date, options } });
  };
  console.log(data);
  return (
    <div className="featured">
      {loading ? (
        "loading"
      ) : (
        <>
          <div className="featuredItem" onClick={() => handleProperty("cairo")}>
            <img
              src="https://www.kids-world-travel-guide.com/images/xbasilscathedral_FelipeFrazao_ssk-2.jpg.pagespeed.ic.nd-oP-JnIw.webp"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Cairo</h1>
              <h2>{data[0]} properties</h2>
            </div>
          </div>
          <div className="featuredItem" onClick={() => handleProperty("giza")}>
            <img
              src="https://www.kids-world-travel-guide.com/images/xital_pisa_500.jpg.pagespeed.ic.Tr6r4IEdE2.webp"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Giza</h1>
              <h2>{data[1]} properties</h2>
            </div>
          </div>

          <div
            className="featuredItem"
            onClick={() => handleProperty("alexandria")}
          >
            <img
              src="https://www.kids-world-travel-guide.com/images/xparis_eiffeltower_ssk500.jpeg.pagespeed.ic.k1hzu_w6jL.webp"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Alexandria</h1>
              <h2>{data[2]} properties</h2>
            </div>
          </div>
          <div className="featuredItem" onClick={() => handleProperty("aswan")}>
            <img
              src="https://cf.bstatic.com/xdata/images/hotel/square200/370395270.webp?k=0f67fec12c242e52a71c4e43844ebf8914320cb62067df6d91e94a66a918c343&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Aswan</h1>
              <h2>{data[3]} properties</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;
