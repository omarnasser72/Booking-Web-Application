import "./propertyList.css";
import useFetch from "../../hooks/useFetch.js";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";

const PropertyList = () => {
  const { data, loading, error } = useFetch("/hotels/countByType");
  if (error) console.log(error);
  const images = [
    "https://images.jdmagicbox.com/comp/mumbai/10/022pgl01810/catalogue/taj-lands-end-hotel-bandra-west-mumbai-5-star-hotels-4swt18.jpg?clr=",
    "https://exej2saedb8.exactdn.com/wp-content/uploads/2022/02/Screen-Shot-2022-02-04-at-2.28.40-PM.png?strip=all&lossy=1&ssl=1",
    "https://www.beaches.com/blog/content/images/2021/03/Beaches-Turks-Caicos-Overview.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/295090917.jpg?k=d17621b71b0eaa0c7a37d8d8d02d33896cef75145f61e7d96d296d88375a7d39&o=&hp=1",
    "https://hips.hearstapps.com/hmg-prod/images/cozy-winter-cabins-1603479244.jpg?crop=1.00xw:0.760xh;0,0.217xh&resize=1200:*",
  ];
  const navigate = useNavigate();
  const handleClick = async (type) => {
    if (type !== "hotel") navigate(`ListAll/${type}s`);
    try {
      await axios.get(`/${type}s`);
      navigate(`ListAll/${type}s`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="pList">
      {loading ? (
        <img
          className="uploadHotelIcon"
          src="https://media.tenor.com/hlKEXPvlX48AAAAj/loading-loader.gif"
        />
      ) : (
        <>
          {data &&
            images.map((image, i) => (
              <div
                className="pListItem"
                key={i}
                onClick={() => handleClick(data[i]?.type)}
              >
                <img src={image} alt="" className="pListImg" />
                <div className="pListTitle">
                  <h1>{data[i]?.type}</h1>
                  <h2>
                    {data[i]?.count} {data[i]?.type}s
                  </h2>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default PropertyList;
