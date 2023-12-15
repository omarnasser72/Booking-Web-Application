import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import {
  faBed,
  faCalendarDays,
  faCar,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
const Header = ({ type }) => {
  const [openCalender, setOpenCalender] = useState(false);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const handleCounter = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const { dispatch } = useContext(SearchContext);

  const navigate = useNavigate();
  const handleSearch = () => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { destination, date, options },
    });
    navigate("/hotels", { state: { destination, date, options } });
  };

  const handleNavbarbuttons = (page) => {
    navigate(`/${page}`);
  };
  const [calendarClass, setCalendarClass] = useState("dateInList");

  useEffect(() => {
    console.log(date);
  }, [date]);

  useEffect(() => {
    if(type === "list"){
      setCalendarClass("dateInList")
      console.log("yes");
    } else{
      setCalendarClass("dateInHome")
    }
    console.log(type);
  }, [type]);


  return (
    <div className="header">
      <div className={type === "list" ? "headerList listMode" : "headerList"}>
        <div className="headerListItem" onClick={() => handleNavbarbuttons("")}>
          <FontAwesomeIcon icon={faBed} />
          <span>Stays</span>
        </div>
        <div
          className="headerListItem"
          onClick={() => handleNavbarbuttons("Flights")}
        >
          <FontAwesomeIcon icon={faPlane} />
          <span>Flights</span>
        </div>
        <div
          className="headerListItem"
          onClick={() => handleNavbarbuttons("CarRental ")}
        >
          <FontAwesomeIcon icon={faCar} />
          <span>Car Rentals</span>
        </div>
        <div
          className="headerListItem"
          onClick={() => handleNavbarbuttons("AirportTaxies")}
        >
          <FontAwesomeIcon icon={faTaxi} />
          <span>Airport Taxies</span>
        </div>
        <div
          className="headerListItem"
          onClick={() => handleNavbarbuttons("Attractions")}
        >
          <FontAwesomeIcon icon={faBed} />
          <span>Attractions</span>
        </div>
      </div>
      {type !== "list" && (
        <>
          <div className="about">
            Here, you will find best hotel that fits you
          </div>
          {/* <button className="headerBtn" onClick={() => navigate("/login")}>
            Sign in / Register
          </button> */}
          <div className="headerSearch">
            <div className="headerSearchItem">
              <FontAwesomeIcon icon={faBed} className="headerIcon" />
              <input
                type="text"
                placeholder="Where are you going ?"
                className="headerSearchInput"
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="headerSearchItem">
              <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
              <span
                className="headerSearchText"
                onClick={() => {
                  setOpenCalender(!openCalender);
                }}
              >
                {`${format(date[0].startDate, "dd/MM/yyyy ")}`} to
                {`${format(date[0].endDate, " dd/MM/yyyy")}`}
              </span>
              {openCalender && (
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDate([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                  className={type === "list" ? "dateInList" : "dateInHome"}
                  minDate={new Date()}
                />
              )}
            </div>
            <div className="headerSearchItem">
              <FontAwesomeIcon icon={faBed} className="headerIcon" />
              <span
                onClick={() => {
                  setOpenOptions(!openOptions);
                }}
                className="headerSearchText"
              >{`${options.adult} adult ${options.children} children`}</span>
              {openOptions && (
                <div className="options">
                  <div className="optionItem">
                    <span className="optionText">Adult</span>
                    <div className="optionCounter">
                      <button
                        className="optionCounterBtn"
                        onClick={() => handleCounter("adult", "d")}
                        disabled={options.adult <= 1}
                      >
                        -
                      </button>
                      <span className="optionCounterNumber">
                        {options.adult}
                      </span>
                      <button
                        className="optionCounterBtn"
                        onClick={() => handleCounter("adult", "i")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="optionItem">
                    <span className="optionText">Children</span>
                    <div className="optionCounter">
                      <button
                        className="optionCounterBtn"
                        onClick={() => handleCounter("children", "d")}
                        disabled={options.children <= 0}
                      >
                        -
                      </button>
                      <span className="optionCounterNumber">
                        {options.children}
                      </span>
                      <button
                        className="optionCounterBtn"
                        onClick={() => handleCounter("children", "i")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="headerSearchItem">
              <button className="headerSearchBtn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
