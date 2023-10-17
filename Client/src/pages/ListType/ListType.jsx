import "./listType.scss";
import Navbar from "../../components/navbar/Navbar.jsx";
import Header from "../../components/header/Header.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
const ListType = () => {
  const location = useLocation();
  console.log(location);
  const propertyType = location.pathname.split("/")[2];
  const { data, loading, error, reFetch } = useFetch(`/${propertyType}`);
  console.log(data);
  const msg =
    propertyType !== "hotels" ? "Still working on it" : "No result to show";
  const h = (data.length / 4) * 200;
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper" style={{ height: `${h}vh` }}>
          <div className="listResult">
            {loading ? (
              <h3>loading</h3>
            ) : (
              <>
                {data.length > 0 ? (
                  data.map((item) => <SearchItem item={item} key={item._id} />)
                ) : (
                  <div className="noResults">
                    <h3>{msg}</h3>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListType;
