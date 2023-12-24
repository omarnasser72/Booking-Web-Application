import React, { useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import checkoutFailed from "./checkoutFailed.scss";
import Footer from "../../components/footer/Footer";
import MailList from "../../components/mailList/MailList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "../../axios";

const CheckOutFailed = () => {
  const reservationId = new URL(window.location.href).hash.split("?")[1];

  useEffect(() => {
    const deleteReservation = async () => {
      const res = await axios
        .delete(`/reservations/${reservationId}`)
        .catch((err) => {
          console.log(err);
        });
      console.log(res);
    };
    deleteReservation();
  }, [reservationId]);
  return (
    <div className="checkoutContainer">
      <Navbar />
      <div className="checkout">
        <img src="https://res.cloudinary.com/omarnasser/image/upload/v1703112234/pngegg_jppaqt.png" />
      </div>
      <div className="checkoutMsg">
        <h2>Checkout Failed </h2>
        <FontAwesomeIcon icon={faTimes} className="checkIcon" />
      </div>
      <MailList />
      <Footer />
    </div>
  );
};

export default CheckOutFailed;
