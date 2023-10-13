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
          {/* <div className="listSearch">
            <h1 className="listSearchTitle">Search</h1>
            <div className="listSearchItem">
              <label>Destination</label>
              <input
                type="text"
                placeholder={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
            </div>
            <div className="listSearchItem">
              <label>Check in Date</label>
              <span
                onClick={() => {
                  setOpenDate(!openDate);
                }}
              >{`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
                date[0].endDate,
                "MM/dd/yyyy"
              )}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => {
                    setDate([item.selection]);
                  }}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="listSearchItem">
              <div className="optionItems">
                <label>Options</label>
                <div className="optionItem">
                  <span className="optionItemLabel">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="text"
                    placeholder={min}
                    onChange={(event) => setMin(event.target.value)}
                  />
                </div>
                <div className="optionItem">
                  <span className="optionItemLabel">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="text"
                    placeholder={max}
                    onChange={(event) => setMax(event.target.value)}
                  />
                </div>
                <div className="optionItem">
                  <span className="optionItemLabel">Adult</span>
                  <input
                    type="number"
                    min={1}
                    placeholder={options.adult}
                    onChange={(e) => handleCounter("adult", e.target.value)}
                  />
                </div>
                <div className="optionItem">
                  <span className="optionItemLabel">Children</span>
                  <input
                    type="number"
                    min={0}
                    placeholder={options.children}
                    onChange={(e) => handleCounter("children", e.target.value)}
                  />
                </div>
                <div className="optionItem">
                  <span className="optionItemLabel">Rooms</span>
                  <input
                    type="number"
                    min={1}
                    placeholder={options.room}
                    onChange={(e) => handleCounter("room", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div> */}
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
