import React, { useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import checkoutSuccess from "./checkoutSuccess.scss";
import Footer from "../../components/footer/Footer";
import MailList from "../../components/mailList/MailList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const CheckOutSuccess = () => {
  const reservationId = new URL(window.location.href).hash.split("?")[1];
  console.log(reservationId);
  const navigate = useNavigate();

  const {
    data: reservation,
    loading,
    error,
    reFetch,
  } = useFetch(`/reservations/${reservationId}`);

  const getDatesInRange = (startDate, endDate) => {
    if (startDate === undefined) {
      return []; // Return an empty array if startDate is undefined
    }
    const start = new Date(startDate);
    const end = new Date(endDate);

    const initialDate =
      startDate !== undefined ? new Date(start.getTime()) : "";
    const dates = [];

    while (initialDate <= end) {
      dates.push(new Date(initialDate).getTime());
      initialDate.setDate(new Date(initialDate.getDate() + 1));
    }
    return dates;
  };

  useEffect(() => {
    if (reservation && reservation.roomNumberId !== undefined) {
      console.log(reservation.roomNumberId);
      const reserveRoom = async () => {
        const allDates =
          reservation?.reservationDuration?.startDate !== undefined &&
          reservation?.reservationDuration?.endDate !== undefined
            ? getDatesInRange(
                reservation.reservationDuration.startDate,
                reservation.reservationDuration.endDate
              )
            : null;

        await axios
          .put(`/rooms/availability/${reservation.roomNumberId}`, {
            headers: { accesstoken: localStorage.getItem("accessToken") },
            dates: allDates,
          })
          .catch((err) => {
            console.log(err);
            navigate(`/checkoutFailed/${reservationId}`);
          });

        reservation.payed = true;
        await axios
          .put(`/reservations/${reservationId}`, { reservation })
          .catch((err) => {
            console.log(err);
          });
      };
      reserveRoom();
      console.log("reserveRoom has been called.");
    }
  }, [reservation, reservation.roomNumberId]);

  return (
    <div className="checkoutContainer">
      <Navbar />
      <div className="checkout">
        <img src="https://res.cloudinary.com/omarnasser/image/upload/v1703110235/bill_cbymlm.png" />
      </div>
      <div className="checkoutMsg">
        <h2>Checkout Completed Successfully</h2>
        <FontAwesomeIcon
          icon={faCheck}
          className="checkIcon"
          style={{ color: "green", fontSize: "xx-large" }}
        />
      </div>
      <MailList />
      <Footer />
    </div>
  );
};

export default CheckOutSuccess;
