import { useLocation } from "react-router-dom";
import Reserve from "../../components/Reserve/Reserve";
import Navbar from "../../components/navbar/Navbar";
import "./reservation.scss";
import { useEffect } from "react";

const Reservation = () => {
  const location = useLocation();
  const hotelId = location.pathname.split("/")[3];
  console.log(hotelId);

  useEffect(() => {
    document.body.scrollIntoView();
  }, []);

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
