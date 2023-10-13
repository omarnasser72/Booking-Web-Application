import { useLocation } from "react-router-dom";
import Reserve from "../../components/Reserve/Reserve";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./reservation.scss";

const Reservation = () => {
  const location = useLocation();
  const hotelId = location.pathname.split("/")[3];
  console.log(hotelId);
  return (
    <div className="reservation">
      <Navbar />

      <div className="reservationContainer">
        <Reserve hotelId={hotelId} />
      </div>
    </div>
  );
};

export default Reservation;
