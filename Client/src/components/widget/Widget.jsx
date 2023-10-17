import "./widget.scss";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import StoreIcon from "@mui/icons-material/Store";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import axios from "../../axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Widget = ({ type }) => {
  let data;
  const navigate = useNavigate();
  const [noOfUsers, setNoOfUsers] = useState();
  const [noOfHotels, setNoOfHotels] = useState();
  const [noOfRooms, setNoOfRooms] = useState();
  const [noOfReservations, setNoOfReservations] = useState();

  const [loading, setLoading] = useState(true);

  const handleWidgets = async (e) => {
    try {
      setNoOfUsers((await axios.get(`/users/getUsers/all`)).data.length);
      setNoOfHotels((await axios.get(`/hotels`)).data.length);
      setNoOfRooms((await axios.get(`/rooms`)).data.length);
      setNoOfReservations((await axios.get(`/reservations`)).data.length);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  handleWidgets();
  const handleDataLink = async (e, link) => {
    switch (link) {
      case "View Users":
        navigate(`/adminDashboard/users`);
        break;
      case "View Hotels":
        navigate(`/adminDashboard/hotels`);
        break;
      case "View Rooms":
        navigate(`/adminDashboard/rooms`);
        break;
      case "View Reservations":
        navigate(`/adminDashboard/reservations`);
        break;
      default:
        break;
    }
  };

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        link: "View Users",
        icon: <PersonOutlinedIcon className="icon" />,
        quantity: noOfUsers,
      };
      break;
    case "hotels":
      data = {
        title: "HOTELS",
        link: "View Hotels",
        icon: <StoreIcon className="icon" />,
        quantity: noOfHotels,
      };
      break;
    case "rooms":
      data = {
        title: "ROOMS",
        link: "View Rooms",
        icon: <MeetingRoomIcon className="icon" />,
        quantity: noOfRooms,
      };
      break;
    case "reservations":
      data = {
        title: "RESERVATIONS",
        link: "View Reservations",
        icon: <BookOnlineIcon className="icon" />,
        quantity: noOfReservations,
      };
      break;
    default:
      break;
  }
  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{loading ? "loading" : data.quantity}</span>
        <span className="link" onClick={(e) => handleDataLink(e, data.link)}>
          {data.link}
        </span>
      </div>
      <div className="right">{data.icon}</div>
    </div>
  );
};

export default Widget;
